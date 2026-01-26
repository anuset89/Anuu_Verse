"""
Test script for the Scroll Loader.
"""
import sys
import os

ROOT_DIR = "/home/kali/Anuu_Verse"
os.chdir(ROOT_DIR)
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from systems.FOUNDATION.anuu_core.scroll_loader import load_scroll, list_available_scrolls, get_system_prompt

print("--- SCROLL LOADER TEST ---")
print(f"Available Scrolls: {list_available_scrolls()}")
print()

# Test loading known archetypes
for archetype in ["anuu", "set", "kilonova", "kali", "libra", "rosa gris", "anuket", "saze", "4nvset", "unknown_archetype"]:
    scroll = load_scroll(archetype)
    print(f"Archetype: '{archetype}' -> Loaded: '{scroll['name']}'")
    print(f"  Prompt (first 50 chars): {scroll['system_prompt'][:50]}...")
    print()

print("--- TEST COMPLETE ---")
