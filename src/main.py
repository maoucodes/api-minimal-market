
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from .middleware.auth_middleware import APIKeyMiddleware
from .middleware.logging_middleware import APICallLoggingMiddleware

app = FastAPI(
    title="API Marketplace",
    description="Your API marketplace with credit-based usage",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.add_middleware(APICallLoggingMiddleware)
app.add_middleware(APIKeyMiddleware)

@app.get("/health")
async def health_check():
    """Health check endpoint - doesn't require API key"""
    return {"status": "healthy"}

@app.get("/api/v1/example")
async def example_endpoint(request: Request):
    """Example protected endpoint that requires API key and deducts credits"""
    user = request.state.user
    return {
        "message": "Hello from protected endpoint!",
        "user_id": user["id"],
        "remaining_credits": user["credits"],
        "data": "Your API response data here"
    }

@app.get("/api/v1/user/credits")
async def get_user_credits(request: Request):
    """Get current user's credit balance"""
    user = request.state.user
    return {
        "user_id": user["id"],
        "credits": user["credits"],
        "email": user["email"]
    }

# Add your other API routes here
# Each route will automatically:
# 1. Validate the API key
# 2. Deduct 1 credit
# 3. Log the API call for dashboard display
# 4. Have access to user info via request.state.user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
