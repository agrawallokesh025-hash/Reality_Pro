import urllib.request
import urllib.error
import json
import time

SUPABASE_URL = "https://octdlzzsvomgrbleqtpx.supabase.co"
API_KEY = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

def get_headers(access_token=None):
    h = {
        "apikey": API_KEY,
        "Content-Type": "application/json"
    }
    if access_token:
        h["Authorization"] = f"Bearer {access_token}"
    else:
        h["Authorization"] = f"Bearer {API_KEY}"
    return h

def authenticate():
    print("--------------------------------------------------")
    print("Step 1: Authenticating administrator...")
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=password"
    data = {
        "email": "test.seller.verified@gmail.com",
        "password": "password123"
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=get_headers())
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            access_token = res_data["access_token"]
            user_id = res_data["user"]["id"]
            print(f"[OK] Success. Authenticated Admin ID: {user_id}")
            return access_token, user_id
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Auth failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return None, None

def test_property_statuses(access_token, user_id):
    print("\n--------------------------------------------------")
    print("Step 2: Testing Property Status Extensions...")
    
    create_url = f"{SUPABASE_URL}/rest/v1/properties"
    headers = get_headers(access_token)
    headers["Prefer"] = "return=representation"
    
    timestamp = int(time.time())
    slug = f"status-verify-prop-{timestamp}"
    property_data = {
        "seller_id": user_id,
        "title": f"Temp Status Verify {timestamp}",
        "slug": slug,
        "description": "Temporary property for status transition E2E checks.",
        "price": 1250000.00,
        "type": "apartment",
        "purpose": "buy",
        "status": "available",
        "address": "123 Verification St",
        "city": "Austin",
        "state": "TX",
        "zip_code": "78701",
        "bedrooms": 2,
        "bathrooms": 2,
        "area_sqft": 1200.00,
        "furnishing_status": "unfurnished"
    }
    
    print(f"Creating temporary test property: {slug}...")
    prop_id = None
    req_create = urllib.request.Request(create_url, data=json.dumps(property_data).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req_create) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            prop_id = res_data[0]["id"]
            print(f"[OK] Temporary property created. ID: {prop_id}")
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to create test property: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to create test property: {e}")
        return False

    # 2. Update status to under_offer
    update_url = f"{SUPABASE_URL}/rest/v1/properties?id=eq.{prop_id}"
    update_data = {
        "status": "under_offer"
    }
    
    print("Updating property status to 'under_offer'...")
    req_update = urllib.request.Request(update_url, data=json.dumps(update_data).encode('utf-8'), headers=headers, method="PATCH")
    status_passed = False
    try:
        with urllib.request.urlopen(req_update) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            if res_data and res_data[0]["status"] == "under_offer":
                print("[OK] Successfully updated property status to 'under_offer'.")
                status_passed = True
            else:
                print("[FAIL] Failed status update check.")
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Error updating property status: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
    except Exception as e:
        print(f"[FAIL] Error updating property status: {e}")

    # 3. Clean up (delete temporary property)
    print("Deleting temporary test property...")
    req_delete = urllib.request.Request(update_url, headers=headers, method="DELETE")
    try:
        urllib.request.urlopen(req_delete)
        print("[OK] Cleaned up temporary test property.")
    except Exception as e:
        print(f"[WARNING] Failed to clean up property: {e}")

    return status_passed

def test_blog_cms(access_token):
    print("\n--------------------------------------------------")
    print("Step 3: Testing Blog CMS CRUD functionality...")
    
    url = f"{SUPABASE_URL}/rest/v1/blog_posts"
    headers = get_headers(access_token)
    headers["Prefer"] = "return=representation"
    
    # 1. Create post
    timestamp = int(time.time())
    slug = f"verification-test-post-{timestamp}"
    post_data = {
        "title": f"Verification Post {timestamp}",
        "slug": slug,
        "content": "This is a detailed verification test for the blog posts CMS.",
        "meta_title": f"SEO Title {timestamp}",
        "meta_description": "SEO description for the blog post.",
        "canonical_url": "https://realtypro.com/original-article",
        "published_at": new_date_iso()
    }
    
    print(f"Creating blog post with slug: {slug}...")
    req = urllib.request.Request(url, data=json.dumps(post_data).encode('utf-8'), headers=headers, method="POST")
    post_id = None
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            post_id = res_data[0]["id"]
            print(f"[OK] Created blog post ID: {post_id}")
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to create blog post: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to create blog post: {e}")
        return False
        
    # 2. Update post
    update_url = f"{SUPABASE_URL}/rest/v1/blog_posts?id=eq.{post_id}"
    update_data = {
        "title": f"Updated Post {timestamp}"
    }
    print(f"Updating blog post ID: {post_id}...")
    req = urllib.request.Request(update_url, data=json.dumps(update_data).encode('utf-8'), headers=headers, method="PATCH")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            if res_data and res_data[0]["title"] == f"Updated Post {timestamp}":
                print("[OK] Successfully updated blog post title.")
            else:
                print("[FAIL] Failed update check.")
                return False
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to update blog post: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to update blog post: {e}")
        return False
        
    # 3. Read post publicly (without admin auth header, only anon bearer)
    public_url = f"{SUPABASE_URL}/rest/v1/blog_posts?id=eq.{post_id}"
    print("Reading blog post publicly (verifying select policies)...")
    req = urllib.request.Request(public_url, headers=get_headers())
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            if res_data:
                print("[OK] Public read query succeeded.")
            else:
                print("[FAIL] Public read returned no rows (check if published_at matches policy).")
                return False
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Public read failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Public read failed: {e}")
        return False

    # 4. Delete post
    print(f"Deleting blog post ID: {post_id}...")
    req = urllib.request.Request(update_url, headers=headers, method="DELETE")
    try:
        urllib.request.urlopen(req)
        print("[OK] Successfully deleted blog post.")
        return True
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to delete blog post: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to delete blog post: {e}")
        return False

def test_email_system():
    print("\n--------------------------------------------------")
    print("Step 4: Testing Email Outbox Logging System...")
    
    url = f"{SUPABASE_URL}/rest/v1/email_logs"
    headers = get_headers()
    headers["Prefer"] = "return=minimal"
    
    log_data = {
        "recipient": "test@leadrealty.com",
        "subject": "Verification Test Notification",
        "status": "sent"
    }
    
    print("Logging dummy email dispatch in email_logs...")
    req = urllib.request.Request(url, data=json.dumps(log_data).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            print("[OK] Successfully created email log entry.")
            return True
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to log email: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to log email: {e}")
        return False

def test_lead_management(access_token, user_id):
    print("\n--------------------------------------------------")
    print("Step 5: Testing Lead Inquiries Status Updates...")
    
    prop_id = get_any_property_id()
    if not prop_id:
        print("[FAIL] Cannot test inquiries without a valid property.")
        return False

    # Submit a new inquiry using admin token and pass user_id to satisfy RLS
    url = f"{SUPABASE_URL}/rest/v1/inquiries"
    headers = get_headers(access_token)
    headers["Prefer"] = "return=representation"
    
    inquiry_data = {
        "property_id": prop_id,
        "name": "Verification Tester",
        "email": "tester@domain.com",
        "phone": "+15551234",
        "message": "Testing out the new email notifications and lead statuses.",
        "status": "new",
        "user_id": user_id
    }
    
    print(f"Submitting new inquiry for property {prop_id} (status='new')...")
    req = urllib.request.Request(url, data=json.dumps(inquiry_data).encode('utf-8'), headers=headers, method="POST")
    inquiry_id = None
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            inquiry_id = res_data[0]["id"]
            status = res_data[0]["status"]
            print(f"[OK] Successfully submitted inquiry ID: {inquiry_id} (Status: {status})")
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to submit inquiry: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to submit inquiry: {e}")
        return False
        
    # 2. Update status as admin (using admin token)
    admin_headers = get_headers(access_token)
    admin_headers["Prefer"] = "return=representation"
    
    update_url = f"{SUPABASE_URL}/rest/v1/inquiries?id=eq.{inquiry_id}"
    update_data = {
        "status": "contacted"
    }
    
    print(f"Updating inquiry ID: {inquiry_id} to status='contacted'...")
    req_update = urllib.request.Request(update_url, data=json.dumps(update_data).encode('utf-8'), headers=admin_headers, method="PATCH")
    try:
        with urllib.request.urlopen(req_update) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            if res_data and res_data[0]["status"] == "contacted":
                print("[OK] Successfully updated inquiry status to 'contacted'.")
                return True
            else:
                print("[FAIL] Failed inquiry status update check.")
                return False
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Error updating inquiry status: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Error updating inquiry status: {e}")
        return False

def test_favorites(access_token, user_id):
    print("\n--------------------------------------------------")
    print("Step 6: Testing Wishlist/Favorites Modules...")
    
    prop_id = get_any_property_id()
    if not prop_id:
        print("[FAIL] Cannot test favorites without a valid property.")
        return False

    url = f"{SUPABASE_URL}/rest/v1/favorites"
    headers = get_headers(access_token)
    headers["Prefer"] = "return=representation"
    
    fav_data = {
        "user_id": user_id,
        "property_id": prop_id
    }
    print(f"Adding property {prop_id} to wishlist...")
    
    check_url = f"{SUPABASE_URL}/rest/v1/favorites?user_id=eq.{user_id}&property_id=eq.{prop_id}"
    req_check = urllib.request.Request(check_url, headers=get_headers(access_token))
    try:
        with urllib.request.urlopen(req_check) as check_res:
            check_data = json.loads(check_res.read().decode('utf-8'))
            if check_data:
                print("Wishlist entry already exists, cleaning up first...")
                delete_url = f"{SUPABASE_URL}/rest/v1/favorites?id=eq.{check_data[0]['id']}"
                req_del = urllib.request.Request(delete_url, headers=headers, method="DELETE")
                urllib.request.urlopen(req_del)
    except Exception as e:
        pass
        
    req = urllib.request.Request(url, data=json.dumps(fav_data).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            fav_id = res_data[0]["id"]
            print(f"[OK] Property added to favorites. Entry ID: {fav_id}")
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to add to favorites: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to add to favorites: {e}")
        return False
        
    # 2. Remove from wishlist
    delete_url = f"{SUPABASE_URL}/rest/v1/favorites?user_id=eq.{user_id}&property_id=eq.{prop_id}"
    print("Removing property from wishlist...")
    req = urllib.request.Request(delete_url, headers=headers, method="DELETE")
    try:
        urllib.request.urlopen(req)
        print("[OK] Property removed from favorites successfully.")
        return True
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to remove from favorites: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to remove from favorites: {e}")
        return False

def test_property_views():
    print("\n--------------------------------------------------")
    print("Step 7: Testing Property Unique View tracking...")
    
    prop_id = get_any_property_id()
    if not prop_id:
        print("[FAIL] Cannot test views without a valid property.")
        return False

    url = f"{SUPABASE_URL}/rest/v1/property_views"
    headers = get_headers()
    headers["Prefer"] = "return=minimal"
    
    view_data = {
        "property_id": prop_id,
        "ip_address": "8.8.8.8"
    }
    
    print(f"Logging a mock property view for property {prop_id}...")
    req = urllib.request.Request(url, data=json.dumps(view_data).encode('utf-8'), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            print("[OK] Property view logged successfully.")
            return True
    except urllib.error.HTTPError as e:
        print(f"[FAIL] Failed to track property view: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return False
    except Exception as e:
        print(f"[FAIL] Failed to track property view: {e}")
        return False

def get_any_property_id():
    url = f"{SUPABASE_URL}/rest/v1/properties?limit=1"
    req = urllib.request.Request(url, headers=get_headers())
    try:
        with urllib.request.urlopen(req) as res:
            properties = json.loads(res.read().decode('utf-8'))
            if properties:
                return properties[0]["id"]
    except Exception as e:
        pass
    return None

def new_date_iso():
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(time.time() - 3600))

def main():
    print("=== REALTY PRO PRODUCTION ENHANCEMENTS VERIFICATION SUITE ===")
    
    access_token, user_id = authenticate()
    if not access_token or not user_id:
        print("Verification aborted due to authentication failure.")
        return
        
    results = {}
    results["property_statuses"] = test_property_statuses(access_token, user_id)
    results["blog_cms"] = test_blog_cms(access_token)
    results["email_system"] = test_email_system()
    results["lead_management"] = test_lead_management(access_token, user_id)
    results["favorites"] = test_favorites(access_token, user_id)
    results["property_views"] = test_property_views()
    
    print("\n==================================================")
    print("SUMMARY VERIFICATION METRICS:")
    all_ok = True
    for test_name, status in results.items():
        symbol = "PASSED" if status else "FAILED"
        print(f"- {test_name.upper()}: {symbol}")
        if not status:
            all_ok = False
            
    print("==================================================")
    if all_ok:
        print("SUCCESS: ALL PRODUCTION DELIVERABLES VERIFIED AND OPERATIONAL!")
    else:
        print("WARNING: SOME VERIFICATION STEPS FAILED. INSPECT LOGS ABOVE.")

if __name__ == "__main__":
    main()
