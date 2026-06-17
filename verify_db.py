import urllib.request
import urllib.error
import json

url = "https://octdlzzsvomgrbleqtpx.supabase.co"
apikey = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

headers = {
    "apikey": apikey,
    "Authorization": f"Bearer {apikey}"
}

resources = {
    "users": f"{url}/rest/v1/users?select=*",
    "properties": f"{url}/rest/v1/properties?select=*",
    "property_images": f"{url}/rest/v1/property_images?select=*",
    "favorites": f"{url}/rest/v1/favorites?select=*",
    "leads": f"{url}/rest/v1/leads?select=*",
    "inquiries": f"{url}/rest/v1/inquiries?select=*",
    "appointments": f"{url}/rest/v1/appointments?select=*",
    "notifications": f"{url}/rest/v1/notifications?select=*",
    "storage_bucket": f"{url}/storage/v1/bucket/properties",
    "list_buckets": f"{url}/storage/v1/bucket"
}

results = {}
list_buckets_data = None
for name, endpoint in resources.items():
    req = urllib.request.Request(endpoint, headers=headers)
    try:
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            content = response.read().decode('utf-8')
            if name == "list_buckets":
                list_buckets_data = json.loads(content)
            results[name] = {"status": status, "success": True, "details": "Table is accessible (200 OK)"}
    except urllib.error.HTTPError as e:
        results[name] = {"status": e.code, "success": False, "details": f"Failed with status {e.code}: {e.reason}"}
    except Exception as e:
        results[name] = {"status": None, "success": False, "details": str(e)}

print("Verification Results:")
print(json.dumps(results, indent=2))
if list_buckets_data is not None:
    print("Buckets Found:")
    print(json.dumps(list_buckets_data, indent=2))
