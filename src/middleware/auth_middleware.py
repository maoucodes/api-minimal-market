
from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
import time
from typing import Optional
from ..utils.apiKeyValidation import validate_api_key_and_deduct_credit, log_api_call

class APIKeyMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            request = Request(scope, receive)
            
            # Skip middleware for certain paths (health checks, docs, etc.)
            skip_paths = ["/docs", "/redoc", "/openapi.json", "/health"]
            if any(request.url.path.startswith(path) for path in skip_paths):
                await self.app(scope, receive, send)
                return
            
            # Get API key from header
            api_key = request.headers.get("X-API-Key") or request.headers.get("Authorization")
            if api_key and api_key.startswith("Bearer "):
                api_key = api_key[7:]  # Remove "Bearer " prefix
            
            if not api_key:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"error": "API key required. Include X-API-Key header or Authorization: Bearer <key>"}
                )
                await response(scope, receive, send)
                return
            
            # Validate API key and deduct credit
            start_time = time.time()
            is_valid, user_profile, error_message = await validate_api_key_and_deduct_credit(api_key)
            
            if not is_valid:
                response = JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED if error_message == "Invalid API key" else status.HTTP_402_PAYMENT_REQUIRED,
                    content={"error": error_message}
                )
                await response(scope, receive, send)
                return
            
            # Add user info to request state
            request.state.user = user_profile
            request.state.start_time = start_time
            
        await self.app(scope, receive, send)
