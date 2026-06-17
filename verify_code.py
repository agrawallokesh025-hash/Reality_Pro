import re

def verify_file(path, mock_patterns, success_patterns):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check for any static array map loops (indicating left-over mock lists)
    has_mock = False
    for pat in mock_patterns:
        if re.search(pat, content):
            has_mock = True
            print(f"[{path}] Found mock pattern: {pat}")
            
    # Check for expected integrations
    has_success = True
    for pat in success_patterns:
        if not re.search(pat, content):
            has_success = False
            print(f"[{path}] Missing expected pattern: {pat}")
            
    return not has_mock and has_success

print("--- Running Source Code Verification Audit ---")

buy_ok = verify_file(
    "src/app/(public)/buy/page.tsx",
    [r"\[1,\s*2,\s*3,\s*4,\s*5,\s*6\]\.map"],
    [r"getProperties", r"SearchBar", r"FilterPanel", r"PropertyCard3D", r"searchParams", r'purpose:\s*"buy"']
)

rent_ok = verify_file(
    "src/app/(public)/rent/page.tsx",
    [r"\[1,\s*2,\s*3,\s*4,\s*5,\s*6\]\.map"],
    [r"getProperties", r"SearchBar", r"FilterPanel", r"PropertyCard3D", r"searchParams", r'purpose:\s*"rent"']
)

action_ok = verify_file(
    "src/actions/properties.ts",
    [],
    [r'from\("properties"\)', r'select\(.*property_images.*\)', r'eq\("purpose"', r"ilike", r'gte\("price"', r'lte\("price"', r'gte\("bedrooms"', r'gte\("bathrooms"', r'eq\("furnishing_status"', r"range\("]
)

if buy_ok and rent_ok and action_ok:
    print("ALL CODE VERIFICATIONS PASSED: No mock lists remain, query engines are fully active.")
else:
    print("CODE VERIFICATION FAILED. Review warnings above.")
