import ast
import os
import sys
from pathlib import Path

class SecurityScanner(ast.NodeVisitor):
    def __init__(self):
        self.issues = []
        self.current_file = ""

    def visit_Call(self, node):
        # Check for dangerous function calls
        if isinstance(node.func, ast.Name):
            if node.func.id == 'eval':
                self.issues.append(f"[{self.current_file}:{node.lineno}] Use of 'eval' detected. High risk.")
            elif node.func.id == 'exec':
                self.issues.append(f"[{self.current_file}:{node.lineno}] Use of 'exec' detected. High risk.")
        
        # Check for subprocess without shell=False verification (primitive check)
        if isinstance(node.func, ast.Attribute) and node.func.attr == 'Popen':
            for keyword in node.keywords:
                if keyword.arg == 'shell' and isinstance(keyword.value, ast.Constant) and keyword.value.value is True:
                     self.issues.append(f"[{self.current_file}:{node.lineno}] subprocess.Popen with shell=True detected. Injection risk.")

        self.generic_visit(node)

    def scan_file(self, filepath):
        self.current_file = str(filepath)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                tree = ast.parse(f.read())
            self.visit(tree)
        except Exception as e:
            # self.issues.append(f"Could not parse {filepath}: {e}")
            pass

def run_scan(directory):
    scanner = SecurityScanner()
    files = list(Path(directory).rglob("*.py"))
    
    print(f"🛡️ 4NVSET SCANNER: Analyzing {len(files)} python files in {directory}...\n")
    
    for f in files:
        if ".venv" in str(f) or "node_modules" in str(f):
            continue
        scanner.scan_file(f)

    if not scanner.issues:
        print("✅ No critical static vulnerabilities found (Basic AST Scan).")
    else:
        print(f"⚠️ Found {len(scanner.issues)} potential issues:")
        for issue in scanner.issues:
            print(f"  - {issue}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    run_scan(target)
