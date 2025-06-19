
import os
from typing import Optional, Tuple
from supabase import create_client, Client
import asyncio
from datetime import datetime
import time

# Initialize Supabase client
SUPABASE_URL = "https://teylvjdhzhrvokhdixqy.supabase.co"
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_SERVICE_KEY:
    raise ValueError("SUPABASE_SERVICE_ROLE_KEY environment variable is required")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async def validate_api_key_and_deduct_credit(api_key: str) -> Tuple[bool, Optional[dict], Optional[str]]:
    """
    Validate API key and deduct 1 credit from user's account.
    
    Returns:
        Tuple of (is_valid, user_profile, error_message)
    """
    try:
        # Get user profile by API key
        response = supabase.table('profiles').select('*').eq('api_key', api_key).single().execute()
        
        if not response.data:
            return False, None, "Invalid API key"
        
        user_profile = response.data
        
        # Check if user has enough credits
        if user_profile['credits'] <= 0:
            return False, user_profile, "Insufficient credits"
        
        # Deduct 1 credit
        new_credits = user_profile['credits'] - 1
        update_response = supabase.table('profiles').update({
            'credits': new_credits,
            'updated_at': datetime.utcnow().isoformat()
        }).eq('id', user_profile['id']).execute()
        
        if update_response.data:
            user_profile['credits'] = new_credits
            return True, user_profile, None
        else:
            return False, user_profile, "Failed to deduct credit"
            
    except Exception as e:
        print(f"Error validating API key: {str(e)}")
        return False, None, f"Error validating API key: {str(e)}"

async def log_api_call(user_id: str, api_id: str, endpoint: str, method: str, 
                      status_code: int, response_time_ms: int, credits_used: int = 1):
    """
    Log API call to the database for dashboard display.
    """
    try:
        api_call_data = {
            'user_id': user_id,
            'api_id': api_id,
            'endpoint': endpoint,
            'method': method,
            'status_code': status_code,
            'response_time': response_time_ms,
            'credits_used': credits_used,
            'created_at': datetime.utcnow().isoformat()
        }
        
        print(f"Logging API call: {api_call_data}")
        response = supabase.table('api_calls').insert(api_call_data).execute()
        
        if response.data:
            print(f"Successfully logged API call for user {user_id}")
            return response.data
        else:
            print(f"Failed to log API call: {response}")
            return None
        
    except Exception as e:
        print(f"Error logging API call: {str(e)}")
        return None
