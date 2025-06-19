
from fastapi import Request, Response
from fastapi.responses import JSONResponse
import time
import uuid
from ..utils.apiKeyValidation import log_api_call, supabase

class APICallLoggingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request = Request(scope, receive)
            
            # Skip logging for certain paths
            skip_paths = ["/docs", "/redoc", "/openapi.json", "/health"]
            if any(request.url.path.startswith(path) for path in skip_paths):
                await self.app(scope, receive, send)
                return
            
            start_time = getattr(request.state, 'start_time', time.time())
            
            async def send_wrapper(message):
                if message["type"] == "http.response.start":
                    # Calculate response time
                    response_time_ms = int((time.time() - start_time) * 1000)
                    status_code = message["status"]
                    
                    # Log the API call if user is authenticated
                    if hasattr(request.state, 'user') and request.state.user:
                        user = request.state.user
                        
                        # Get or create API ID for this endpoint
                        api_id = await get_or_create_api_id_for_endpoint(
                            request.url.path, 
                            request.method
                        )
                        
                        if api_id:
                            await log_api_call(
                                user_id=user['id'],
                                api_id=api_id,
                                endpoint=str(request.url.path),
                                method=request.method,
                                status_code=status_code,
                                response_time_ms=response_time_ms,
                                credits_used=1
                            )
                
                await send(message)
            
            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)

async def get_or_create_api_id_for_endpoint(endpoint_path: str, method: str) -> str:
    """
    Get or create API ID for the given endpoint path and method.
    This will check if an API exists for this endpoint, and create one if it doesn't.
    """
    try:
        # First, try to find an existing API for this endpoint
        response = supabase.table('apis').select('id').eq('endpoint_path', endpoint_path).eq('endpoint_method', method).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0]['id']
        
        # If no API exists, create a new one
        api_name = f"{method} {endpoint_path}"
        api_data = {
            'name': api_name,
            'endpoint_path': endpoint_path,
            'endpoint_method': method,
            'description': f'Auto-generated API for {method} {endpoint_path}',
            'category': 'Auto-generated',
            'status': 'active',
            'version': 'v1.0.0'
        }
        
        create_response = supabase.table('apis').insert(api_data).execute()
        
        if create_response.data and len(create_response.data) > 0:
            print(f"Created new API record for {method} {endpoint_path}")
            return create_response.data[0]['id']
        else:
            print(f"Failed to create API record for {method} {endpoint_path}")
            return None
            
    except Exception as e:
        print(f"Error getting/creating API ID for {method} {endpoint_path}: {str(e)}")
        return None
