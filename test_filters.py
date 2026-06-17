import urllib.request
import urllib.error
import json

url = "https://octdlzzsvomgrbleqtpx.supabase.co"
apikey = "sb_publishable_jlEC5T_1VTB-tfugB3CLiw_T-gZwQH5"

headers = {
    "apikey": apikey,
    "Authorization": f"Bearer {apikey}"
}

def query_api(params_str, extra_headers=None):
    endpoint = f"{url}/rest/v1/properties?select=*,property_images(*)"
    if params_str:
        endpoint += f"&{params_str}"
    
    req_headers = headers.copy()
    if extra_headers:
        req_headers.update(extra_headers)
        
    req = urllib.request.Request(endpoint, headers=req_headers)
    try:
        with urllib.request.urlopen(req) as response:
            content = response.read().decode('utf-8')
            return json.loads(content)
    except Exception as e:
        print(f"Error querying {endpoint}: {e}")
        return []

print("=== STARTING MIGRATED QUERY LAYER TEST ===")

# Test 1: Location Search (e.g. "Malibu")
print("\nTest 1: Location Search for 'Malibu'")
results = query_api("or=(city.ilike.%25Malibu%25,state.ilike.%25Malibu%25,address.ilike.%25Malibu%25,title.ilike.%25Malibu%25)")
print(f"Found {len(results)} properties in Malibu.")
for p in results:
    print(f" - {p['title']} in {p['city']}, {p['state']} (${p['price']})")

# Test 2: Property Type Filter (e.g. "villa")
print("\nTest 2: Property Type Filter for 'villa'")
results = query_api("type=eq.villa")
print(f"Found {len(results)} villas.")
for p in results:
    print(f" - {p['title']} (Type: {p['type']}, Price: ${p['price']})")

# Test 3: Buy/Rent Filter (e.g. "purpose = rent")
print("\nTest 3: Purpose Filter for 'rent'")
results = query_api("purpose=eq.rent")
print(f"Found {len(results)} rentals.")
for p in results:
    print(f" - {p['title']} (Purpose: {p['purpose']}, Price: ${p['price']})")

# Test 4: Price Range Filter (e.g. price >= 1,000,000 and price <= 4,000,000)
print("\nTest 4: Price Range Filter ($1,000,000 to $4,000,000)")
results = query_api("price=gte.1000000&price=lte.4000000")
print(f"Found {len(results)} properties in range.")
for p in results:
    print(f" - {p['title']} (Price: ${p['price']})")

# Test 5: Bedrooms Filter (e.g. bedrooms >= 3)
print("\nTest 5: Bedrooms Filter (>= 3 beds)")
results = query_api("bedrooms=gte.3")
print(f"Found {len(results)} properties with 3+ beds.")
for p in results:
    print(f" - {p['title']} ({p['bedrooms']} beds)")

# Test 6: Bathrooms Filter (e.g. bathrooms >= 3)
print("\nTest 6: Bathrooms Filter (>= 3 baths)")
results = query_api("bathrooms=gte.3")
print(f"Found {len(results)} properties with 3+ baths.")
for p in results:
    print(f" - {p['title']} ({p['bathrooms']} baths)")

# Test 7: Furnished Filter (e.g. furnishing_status = furnished)
print("\nTest 7: Furnished Filter ('furnished')")
results = query_api("furnishing_status=eq.furnished")
print(f"Found {len(results)} furnished properties.")
for p in results:
    print(f" - {p['title']} ({p['furnishing_status']})")

# Test 8: Ready-to-move Filter (e.g. property_age = 0 and status = available)
print("\nTest 8: Ready-to-move Filter")
results = query_api("property_age=eq.0&status=eq.available")
print(f"Found {len(results)} ready-to-move properties.")
for p in results:
    print(f" - {p['title']} (Age: {p['property_age']}, Status: {p['status']})")

# Test 9: Pagination (Page 1 size 5, Page 2 size 5)
print("\nTest 9: Pagination Verification (Page size = 5)")
page1 = query_api("order=id", {"Range": "0-4", "Range-Unit": "items", "Prefer": "count=exact"})
page2 = query_api("order=id", {"Range": "5-9", "Range-Unit": "items", "Prefer": "count=exact"})
print(f"Page 1 returned {len(page1)} records.")
print(f"Page 2 returned {len(page2)} records.")
p1_ids = set(p['id'] for p in page1)
p2_ids = set(p['id'] for p in page2)
overlap = p1_ids.intersection(p2_ids)
print(f"Overlap between Page 1 and Page 2: {len(overlap)} records (Should be 0).")

# Test 10: Sorting (Price Ascending vs Price Descending)
print("\nTest 10: Sorting Verification")
asc_results = query_api("order=price.asc&limit=3")
desc_results = query_api("order=price.desc&limit=3")
print("Price Ascending (First 3):")
for p in asc_results:
    print(f" - {p['title']} (${p['price']})")
print("Price Descending (First 3):")
for p in desc_results:
    print(f" - {p['title']} (${p['price']})")

print("\n=== VERIFICATION COMPLETE ===")
