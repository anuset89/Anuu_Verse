import sys
import os
sys.path.append(os.getcwd())

from systems.FOUNDATION.anuu_core.memory import anuu_memory

print("--- Checking Semantic Knowledge ---")
# Query for anything related to "insight" or just peek at the collection if possible
# Since we don't have a 'get_all' easily exposed in MemoryCore (it filters by query), 
# we will use the client directly to peek or just query a generic term.

try:
    # Access raw collection to peek
    count = anuu_memory.semantic.count()
    print(f"Total Semantic Memories: {count}")
    
    if count > 0:
        peek = anuu_memory.semantic.peek()
        print(f"Peek: {peek}")
    else:
        print("Collection is empty.")

    print("\n--- Checking Interaction Memory ---")
    count_epi = anuu_memory.episodic.count()
    print(f"Total Episodic Memories: {count_epi}")

except Exception as e:
    print(f"Error inspecting DB: {e}")
