
# FastAPI Backend Setup for API Key Validation and Credit Management

## Overview
This setup provides:
1. API key validation middleware
2. Automatic credit deduction (1 credit per request)
3. API call logging for dashboard display
4. User authentication and authorization

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in your project root:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

Get your service role key from:
Supabase Dashboard > Project Settings > API > service_role key

### 3. Run the Server
```bash
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## How It Works

### API Key Validation
- Every request (except health checks and docs) requires an API key
- Include API key in header: `X-API-Key: your_api_key_here`
- Or use Authorization header: `Authorization: Bearer your_api_key_here`

### Credit System
- Each valid API request deducts 1 credit from user's account
- Returns 402 Payment Required if insufficient credits
- Returns 401 Unauthorized for invalid API keys

### API Call Logging
- All API calls are automatically logged to the `api_calls` table
- Includes response time, status code, endpoint, method
- Data appears in user's dashboard under "Recent API Calls"

### Example Request
```bash
curl -X GET "http://localhost:8000/api/v1/example" \
  -H "X-API-Key: your_api_key_here"
```

### Example Response
```json
{
  "message": "Hello from protected endpoint!",
  "user_id": "user-uuid",
  "remaining_credits": 99,
  "data": "Your API response data here"
}
```

## Adding New Endpoints
Simply add new routes to `main.py`. They will automatically:
1. Validate API key
2. Deduct credits
3. Log the call
4. Have access to user info via `request.state.user`

```python
@app.get("/api/v1/your-endpoint")
async def your_endpoint(request: Request):
    user = request.state.user
    # Your endpoint logic here
    return {"data": "response"}
```
