import urllib.request
import urllib.error
import json

SUPABASE_URL = "https://octdlzzsvomgrbleqtpx.supabase.co"
API_KEY = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

headers = {
    "apikey": API_KEY,
    "Content-Type": "application/json"
}

def signup_seller():
    print("Step 1: Signing up new verified seller...")
    url = f"{SUPABASE_URL}/auth/v1/signup"
    data = {
        "email": "test.seller.verified@gmail.com",
        "password": "password123",
        "options": {
            "data": {
                "full_name": "Verified Seller"
            }
        }
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            user_id = res_data["user"]["id"]
            print(f"Success. Registered User ID: {user_id}")
            print("\nStep 2: Please run this query in your Supabase SQL Editor to make this user a seller:")
            print(f"UPDATE public.users SET role = 'seller' WHERE id = '{user_id}';")
            return user_id
    except urllib.error.HTTPError as e:
        print(f"Signup failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return None
    except Exception as e:
        print(f"Signup error: {e}")
        return None

if __name__ == "__main__":
    signup_seller()
