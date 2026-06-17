import urllib.request
import urllib.error
import json
import time

url = "https://octdlzzsvomgrbleqtpx.supabase.co"
apikey = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

headers = {
    "apikey": apikey,
    "Authorization": f"Bearer {apikey}",
    "Prefer": "count=exact"
}

tables = ["users", "properties", "property_images"]
counts = {}

print("--- Supabase Data Availability Check ---")
for table in tables:
    endpoint = f"{url}/rest/v1/{table}?select=id&limit=1"
    req = urllib.request.Request(endpoint, headers=headers)
    try:
        start_time = time.time()
        with urllib.request.urlopen(req) as response:
            latency = (time.time() - start_time) * 1000
            content_range = response.headers.get("Content-Range")
            # Content-Range is usually like "0-0/12"
            count = 0
            if content_range and "/" in content_range:
                count = int(content_range.split("/")[1])
            counts[table] = {"count": count, "latency_ms": round(latency, 2), "status": 200}
            print(f"Table '{table}': {count} records found (Latency: {latency:.2f}ms)")
    except urllib.error.HTTPError as e:
        counts[table] = {"count": 0, "status": e.code, "error": str(e)}
        print(f"Table '{table}': Error {e.code} ({e.reason})")
    except Exception as e:
        counts[table] = {"count": 0, "status": None, "error": str(e)}
        print(f"Table '{table}': Error: {str(e)}")

print("\nCounts data:")
print(json.dumps(counts, indent=2))
