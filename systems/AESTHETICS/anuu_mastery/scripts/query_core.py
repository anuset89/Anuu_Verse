import json
import sys
import difflib

def load_core():
    try:
        with open('../resources/ANUU_CORE_161914.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: Core not found.")
        return None

def search_core(query, data, path=""):
    results = []
    
    if isinstance(data, dict):
        for k, v in data.items():
            # Check key similarity
            if query.lower() in k.lower():
                results.append(f"[{path}.{k}]: (Key Match)")
            
            # Recursive search
            if isinstance(v, (dict, list)):
                results.extend(search_search(query, v, f"{path}.{k}"))
            elif isinstance(v, str):
                if query.lower() in v.lower():
                    snippet = v[:100] + "..." if len(v) > 100 else v
                    results.append(f"[{path}.{k}]: {snippet}")
                    
    elif isinstance(data, list):
        for i, item in enumerate(data):
            if isinstance(item, (dict, list)):
                results.extend(search_search(query, item, f"{path}[{i}]"))
            elif isinstance(item, str):
                if query.lower() in item.lower():
                    snippet = item[:100] + "..." if len(item) > 100 else item
                    results.append(f"[{path}[{i}]]: {snippet}")
                    
    return results

# Helper due to recursion naming error in snippet above
def search_search(query, data, path=""):
    results = []
    if isinstance(data, dict):
        for k, v in data.items():
            if query.lower() in k.lower():
                results.append(f"Found Key: {path}/{k}")
            if isinstance(v, (dict, list)):
                results.extend(search_search(query, v, f"{path}/{k}"))
            elif isinstance(v, str) and query.lower() in v.lower():
                results.append(f"Found Content in {path}/{k}: {v[:60]}...")
    elif isinstance(data, list):
        for i, item in enumerate(data):
            results.extend(search_search(query, item, f"{path}[{i}]"))
    return results

def main():
    if len(sys.argv) < 2:
        print("Usage: python query_core.py <search_term>")
        return

    query = sys.argv[1]
    data = load_core()
    
    if not data:
        return

    print(f"Searching Anuu Core for: '{query}'...")
    results = search_search(query, data)
    
    if results:
        print(f"Found {len(results)} matches:")
        for r in results[:10]: # Limit to 10
            print(r)
    else:
        print("No matches found in the Bruma.")

if __name__ == "__main__":
    main()
