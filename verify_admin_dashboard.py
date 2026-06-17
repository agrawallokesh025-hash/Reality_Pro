import urllib.request
import urllib.error
import json
import time

SUPABASE_URL = "https://octdlzzsvomgrbleqtpx.supabase.co"
API_KEY = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

headers = {
    "apikey": API_KEY,
    "Content-Type": "application/json"
}

def authenticate():
    print("Step 1: Authenticating administrator...")
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    data = {
        "email": "test.seller.verified@gmail.com",
        "password": "password123"
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            access_token = res_data["access_token"]
            user_id = res_data["user"]["id"]
            print(f"Success. Authenticated Admin ID: {user_id}")
            return access_token, user_id
    except urllib.error.HTTPError as e:
        print(f"Auth failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return None, None

def upload_mock_image(access_token, user_id, index):
    timestamp = int(time.time() * 1000)
    filename = f"admin_verify_img_{timestamp}_{index}.jpg"
    path = f"{user_id}/{filename}"
    url = f"{SUPABASE_URL}/storage/v1/object/properties/{path}"
    
    jpeg_data = (
        b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06'
        b'\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a'
        b'\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00'
        b'\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00'
        b'\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00'
        b'\x00?\x00\37\x00\xff\xd9'
    )
    
    upload_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "image/jpeg"
    }
    
    req = urllib.request.Request(url, data=jpeg_data, headers=upload_headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/properties/{path}"
            print(f"Uploaded Image {index}: {public_url}")
            return path, public_url
    except Exception as e:
        print(f"Upload error: {e}")
        return None, None

def delete_uploaded_image(access_token, path):
    url = f"{SUPABASE_URL}/storage/v1/object/properties"
    delete_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {"prefixes": [path]}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=delete_headers, method="DELETE")
    try:
        with urllib.request.urlopen(req) as res:
            print(f"Deleted storage file: {path}")
            return True
    except Exception as e:
        print(f"Failed to delete storage file {path}: {e}")
        return False

def create_property(access_token, seller_id, title, slug, price, imageUrls):
    print("Step 3: Deploying test property...")
    url = f"{SUPABASE_URL}/rest/v1/properties"
    prop_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    property_data = {
        "seller_id": seller_id,
        "title": title,
        "slug": slug,
        "description": "Premium verification test villa created by admin dashboard.",
        "price": price,
        "type": "villa",
        "purpose": "buy",
        "status": "available",
        "address": "777 Admin Suite Lane",
        "city": "Malibu",
        "state": "CA",
        "zip_code": "90265",
        "bedrooms": 4,
        "bathrooms": 4,
        "area_sqft": 4200.00,
        "furnishing_status": "furnished",
        "property_age": 0,
        "is_luxury": True,
        "is_new_project": True,
        "is_featured": True,
        "features": ["Smart Access", "Swimming Pool", "Solar Power Integration"]
    }
    
    req = urllib.request.Request(url, data=json.dumps(property_data).encode('utf-8'), headers=prop_headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            prop_id = res_data[0]["id"]
            print(f"Property created. ID: {prop_id}, Slug: {slug}")
            
            # Link images
            images_url = f"{SUPABASE_URL}/rest/v1/property_images"
            images_data = []
            for i, img_url in enumerate(imageUrls):
                images_data.append({
                    "property_id": prop_id,
                    "url": img_url,
                    "is_primary": i == 0
                })
            
            req_img = urllib.request.Request(images_url, data=json.dumps(images_data).encode('utf-8'), headers=prop_headers, method="POST")
            with urllib.request.urlopen(req_img) as res_img:
                print("Images linked successfully.")
                
            return prop_id
    except urllib.error.HTTPError as e:
        print(f"Property creation failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return None
    except Exception as e:
        print(f"Property creation failed: {e}")
        return None

def create_inquiry(access_token, property_id, user_id):
    print("Step 4: Submitting customer inquiry lead on property...")
    url = f"{SUPABASE_URL}/rest/v1/inquiries"
    inq_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    inquiry_data = {
        "property_id": property_id,
        "user_id": user_id,
        "name": "Jane Lead Tester",
        "email": "jane.lead@example.com",
        "phone": "+1 (555) 901-8080",
        "message": "Hello, I am interested in touring the Admin Dashboard Verification Villa.",
        "status": "pending"
    }
    
    req = urllib.request.Request(url, data=json.dumps(inquiry_data).encode('utf-8'), headers=inq_headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            inq_id = res_data[0]["id"]
            print(f"Inquiry created successfully. ID: {inq_id}")
            return inq_id
    except Exception as e:
        print(f"Inquiry failed: {e}")
        return None

def update_inquiry(access_token, inquiry_id):
    print("Step 5: Updating inquiry status to 'contacted'...")
    url = f"{SUPABASE_URL}/rest/v1/inquiries?id=eq.{inquiry_id}"
    update_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    data = {"status": "contacted"}
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=update_headers, method="PATCH")
    try:
        with urllib.request.urlopen(req) as res:
            print("Inquiry status updated successfully.")
            return True
    except Exception as e:
        print(f"Failed to update inquiry status: {e}")
        return False

def create_appointment(access_token, property_id, user_id):
    print("Step 6: Scheduling tour visit appointment...")
    url = f"{SUPABASE_URL}/rest/v1/appointments"
    appt_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }
    
    appointment_data = {
        "property_id": property_id,
        "user_id": user_id,
        "agent_id": user_id,
        "appointment_date": "2026-06-20T10:00:00.000Z",
        "status": "scheduled",
        "message": "Confirming walk-through schedule."
    }
    
    req = urllib.request.Request(url, data=json.dumps(appointment_data).encode('utf-8'), headers=appt_headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            appt_id = res_data[0]["id"]
            print(f"Appointment scheduled successfully. ID: {appt_id}")
            return appt_id
    except Exception as e:
        print(f"Appointment failed: {e}")
        return None

def verify_dashboard_page(url_path, expected_text, cookies_header=None):
    full_url = f"http://localhost:3000{url_path}"
    print(f"Querying: {full_url}")
    try:
        req = urllib.request.Request(full_url, headers={
            "User-Agent": "Mozilla/5.0",
            "Cookie": cookies_header if cookies_header else ""
        })
        with urllib.request.urlopen(req, timeout=10) as res:
            content = res.read().decode('utf-8')
            if expected_text in content:
                print(f" -> PASS: Found '{expected_text}'")
                return True
            else:
                print(f" -> FAIL: Expected text '{expected_text}' NOT found.")
                with open("debug_failed_page.html", "w", encoding="utf-8") as f:
                    f.write(content)
                print(" -> Debug: Saved page content to debug_failed_page.html")
                return False
    except Exception as e:
        print(f" -> ERROR connecting to local dev server: {e}")
        return False

def delete_record(access_token, table, record_id):
    url = f"{SUPABASE_URL}/rest/v1/{table}?id=eq.{record_id}"
    req_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
    }
    req = urllib.request.Request(url, headers=req_headers, method="DELETE")
    try:
        with urllib.request.urlopen(req) as res:
            print(f"Cleaned up {table} record: {record_id}")
            return True
    except Exception as e:
        print(f"Cleanup failed for {table} {record_id}: {e}")
        return False

def get_auth_cookie(access_token, user_id, email):
    import base64
    session = {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": 3600,
        "expires_at": int(time.time()) + 3600,
        "refresh_token": "dummy_refresh_token",
        "user": {
            "id": user_id,
            "email": email
        }
    }
    session_bytes = json.dumps(session).encode('utf-8')
    session_b64 = base64.b64encode(session_bytes).decode('utf-8')
    return f"sb-octdlzzsvomgrbleqtpx-auth-token=base64-{session_b64}"

def run_verification():
    print("=== STARTING ADMIN DASHBOARD INTEGRATION TEST ===")
    
    # 1. Authenticate
    access_token, user_id = authenticate()
    if not access_token or not user_id:
        print("Aborted. Admin credentials login failed.")
        return False
        
    # 2. Upload 2 mock images
    print("\nStep 2: Uploading mock property images...")
    paths = []
    urls = []
    for i in range(1, 3):
        path, url = upload_mock_image(access_token, user_id, i)
        if path and url:
            paths.append(path)
            urls.append(url)
        else:
            # Clean up
            for p in paths:
                delete_uploaded_image(access_token, p)
            return False
            
    # 3. Create property
    timestamp = int(time.time())
    title = f"Admin Verify Villa {timestamp}"
    slug = f"admin-verify-villa-{timestamp}"
    price = 3500000.00
    
    property_id = create_property(access_token, user_id, title, slug, price, urls)
    if not property_id:
        # Clean up
        for p in paths:
            delete_uploaded_image(access_token, p)
        return False
        
    # 4. Create inquiry lead
    inquiry_id = create_inquiry(access_token, property_id, user_id)
    
    # 5. Update inquiry status
    inq_updated = False
    if inquiry_id:
        inq_updated = update_inquiry(access_token, inquiry_id)
        
    # 6. Create appointment visit
    appointment_id = create_appointment(access_token, property_id, user_id)
    
    print("\nAssets deployed successfully. Waiting 3 seconds for index propagation...")
    time.sleep(3)
    
    # 7. Check local pages
    # We need to construct the cookie session format that Next.js Server Components expect.
    # In Supabase SSR, cookies are stored as sb-octdlzzsvomgrbleqtpx-auth-token.
    # To pass middleware, we construct the correct cookie string from our session details!
    cookie_str = get_auth_cookie(access_token, user_id, "test.seller.verified@gmail.com")
    
    print("\nStep 7: Querying local dashboard routes...")
    overview_ok = verify_dashboard_page("/dashboard/overview", "Operational Overview", cookie_str)
    properties_ok = verify_dashboard_page("/dashboard/properties", title, cookie_str)
    inquiries_ok = verify_dashboard_page("/dashboard/inquiries", "Jane Lead Tester", cookie_str)
    appointments_ok = verify_dashboard_page("/dashboard/appointments", "Confirming walk-through schedule", cookie_str)
    analytics_ok = verify_dashboard_page("/dashboard/analytics", "Operations Analytics", cookie_str)
    settings_ok = verify_dashboard_page("/dashboard/settings", "Portal &amp; Website Settings", cookie_str)
    
    # 8. Clean up
    print("\nStep 8: Cleaning up test artifacts...")
    if appointment_id:
        delete_record(access_token, "appointments", appointment_id)
    if inquiry_id:
        delete_record(access_token, "inquiries", inquiry_id)
    if property_id:
        delete_record(access_token, "properties", property_id)
    for p in paths:
        delete_uploaded_image(access_token, p)
        
    # Evaluate
    success = (overview_ok and properties_ok and inquiries_ok and 
               appointments_ok and analytics_ok and settings_ok and inq_updated)
               
    if success:
        print("\n=== E2E DASHBOARD INTEGRATION TEST: PASSED ===")
        return True
    else:
        print("\n=== E2E DASHBOARD INTEGRATION TEST: FAILED ===")
        return False

if __name__ == "__main__":
    run_verification()
