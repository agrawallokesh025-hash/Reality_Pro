import urllib.request
import urllib.error
import json
import time
import random

SUPABASE_URL = "https://octdlzzsvomgrbleqtpx.supabase.co"
API_KEY = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

headers = {
    "apikey": API_KEY,
    "Content-Type": "application/json"
}

def authenticate():
    print("Step 1: Authenticating seller...")
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
            print(f"Success. Authenticated User ID: {user_id}")
            return access_token, user_id
    except urllib.error.HTTPError as e:
        print(f"Auth failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return None, None
    except Exception as e:
        print(f"Auth error: {e}")
        return None, None

def upload_mock_image(access_token, user_id, index):
    timestamp = int(time.time() * 1000)
    filename = f"test_img_{timestamp}_{index}.jpg"
    path = f"{user_id}/{filename}"
    url = f"{SUPABASE_URL}/storage/v1/object/properties/{path}"
    
    # Simple valid 1x1 JPEG content
    jpeg_data = (
        b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00`\x00`\x00\x00\xff\xdb\x00C\x00\x08\x06\x06'
        b'\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a'
        b'\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00'
        b'\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00'
        b'\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xda\x00\x08\x01\x01\x00'
        b'\x00?\x00\x37\x00\xff\xd9'
    )
    
    upload_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "image/jpeg"
    }
    
    req = urllib.request.Request(url, data=jpeg_data, headers=upload_headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            public_url = f"{SUPABASE_URL}/storage/v1/object/public/properties/{path}"
            print(f"Uploaded image {index}: {public_url}")
            return path, public_url
    except urllib.error.HTTPError as e:
        print(f"Upload image {index} failed: {e.code} {e.reason}")
        print(e.read().decode('utf-8'))
        return None, None
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
    print("Step 3: Creating property listing in database...")
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
        "description": "Verification testing property listing with 5 uploaded images.",
        "price": price,
        "type": "apartment",
        "purpose": "buy",
        "status": "available",
        "address": "999 Verification Blvd",
        "city": "Malibu",
        "state": "CA",
        "zip_code": "90265",
        "bedrooms": 3,
        "bathrooms": 3,
        "area_sqft": 2500.00,
        "furnishing_status": "furnished",
        "property_age": 0,
        "is_luxury": True,
        "is_new_project": True,
        "is_featured": True,
        "features": ["Smart Access", "Swimming Pool", "High-speed Fiber Connect"]
    }
    
    req = urllib.request.Request(url, data=json.dumps(property_data).encode('utf-8'), headers=prop_headers, method="POST")
    try:
        with urllib.request.urlopen(req) as res:
            res_data = json.loads(res.read().decode('utf-8'))
            if not res_data:
                print("Empty response inserting property.")
                return None
            prop_id = res_data[0]["id"]
            print(f"Property created. ID: {prop_id}, Slug: {slug}")
            
            # Step 3.5: Insert property images
            print("Step 4: Linking uploaded images to property...")
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
        print(f"Property creation error: {e}")
        return None

def delete_property(access_token, property_id):
    url = f"{SUPABASE_URL}/rest/v1/properties?id=eq.{property_id}"
    prop_headers = {
        "apikey": API_KEY,
        "Authorization": f"Bearer {access_token}",
    }
    req = urllib.request.Request(url, headers=prop_headers, method="DELETE")
    try:
        with urllib.request.urlopen(req) as res:
            print(f"Deleted property listing: {property_id}")
            return True
    except Exception as e:
        print(f"Failed to delete property {property_id}: {e}")
        return False

def verify_local_page(url_path, expected_text):
    full_url = f"http://localhost:3000{url_path}"
    print(f"Querying local server: {full_url}")
    try:
        req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as res:
            content = res.read().decode('utf-8')
            if expected_text in content:
                print(f" -> PASS: Found expected content: '{expected_text}'")
                return True
            else:
                print(f" -> FAIL: Expected text '{expected_text}' NOT found in page source.")
                return False
    except Exception as e:
        print(f" -> ERROR: Failed to connect or query {full_url}: {e}")
        return False

def run_verification():
    print("=== STARTING FULL END-TO-END VERIFICATION ===")
    
    # 1. Authenticate
    access_token, user_id = authenticate()
    if not access_token or not user_id:
        print("Verification halted due to authentication failure.")
        return False
    
    # 2. Upload 5 images
    print("\nStep 2: Uploading 5 mock property images...")
    uploaded_paths = []
    uploaded_urls = []
    for i in range(1, 6):
        path, url = upload_mock_image(access_token, user_id, i)
        if path and url:
            uploaded_paths.append(path)
            uploaded_urls.append(url)
        else:
            print("Failed to upload all 5 images. Aborting.")
            # Clean up what was uploaded
            for p in uploaded_paths:
                delete_uploaded_image(access_token, p)
            return False
            
    print(f"Successfully uploaded {len(uploaded_urls)} images.")
    
    # 3. Create property and link images
    timestamp = int(time.time())
    title = f"Test Verification Penthouse {timestamp}"
    slug = f"test-verification-penthouse-{timestamp}"
    price = 1250000.00
    
    property_id = create_property(access_token, user_id, title, slug, price, uploaded_urls)
    if not property_id:
        print("Failed to create property. Cleaning up uploaded files.")
        for p in uploaded_paths:
            delete_uploaded_image(access_token, p)
        return False
        
    print("\nListing deployed successfully. Sleeping 3 seconds to let Supabase propagate indices...")
    time.sleep(3)
    
    # 4. Verify search results and listing pages
    print("\nStep 5: Verifying listing on local dev server...")
    
    # Check on buy search page
    search_path = f"/buy?location=Malibu"
    search_passed = verify_local_page(search_path, title)
    
    # Check details page renders correctly
    details_path = f"/properties/{slug}"
    details_passed = verify_local_page(details_path, title)
    
    # Also verify that the detail page contains image urls
    print(f"Checking details page for image URL {uploaded_urls[0]}")
    images_passed = verify_local_page(details_path, uploaded_urls[0])
    
    # 5. Clean up database and storage
    print("\nStep 6: Cleaning up verification assets...")
    db_cleanup_success = delete_property(access_token, property_id)
    
    storage_cleanup_success = True
    for p in uploaded_paths:
        if not delete_uploaded_image(access_token, p):
            storage_cleanup_success = False
            
    # Check overall status
    if search_passed and details_passed and images_passed and db_cleanup_success and storage_cleanup_success:
        print("\n=== VERIFICATION RESULT: PASSED (100% Success) ===")
        return True
    else:
        print("\n=== VERIFICATION RESULT: FAILED ===")
        print(f"Search Page check: {'PASS' if search_passed else 'FAIL'}")
        print(f"Details Page check: {'PASS' if details_passed else 'FAIL'}")
        print(f"Image Rendering check: {'PASS' if images_passed else 'FAIL'}")
        print(f"Database Cleanup check: {'PASS' if db_cleanup_success else 'FAIL'}")
        print(f"Storage Cleanup check: {'PASS' if storage_cleanup_success else 'FAIL'}")
        return False

if __name__ == "__main__":
    run_verification()
