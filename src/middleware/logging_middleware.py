
from fastapi import Request, Response
from fastapi.responses import JSONResponse
import time
import uuid
from ..utils.apiKeyValidation import log_api_call

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
                        
                        # You'll need to determine the API ID based on your routing
                        # For now, using a placeholder - you should map endpoints to API IDs
                        api_id = await get_api_id_for_endpoint(request.url.path)
                        
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

async def get_api_id_for_endpoint(endpoint_path: str) -> str:
    """
    Map endpoint paths to API IDs from your database.
    You should implement this based on your API structure.
    """
    # This is a placeholder - you should query your apis table
    # to get the actual API ID based on the endpoint
    
    # For now, return a default API ID or create one
    # You might want to create a mapping table or use the endpoint path
    return str(uuid.uuid4())  # Placeholder - replace with actual logic
