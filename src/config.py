
import os
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = "https://teylvjdhzhrvokhdixqy.supabase.co"
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_SERVICE_KEY:
    raise ValueError(
        "SUPABASE_SERVICE_ROLE_KEY environment variable is required. "
        "Get it from your Supabase project settings > API > service_role key"
    )

# API configuration
API_KEY_HEADER = "X-API-Key"
CREDITS_PER_REQUEST = 1
