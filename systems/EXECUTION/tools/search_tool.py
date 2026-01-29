"""
Anuu Search Tool
Wraps duckduckgo-search for agentic use.
"""
from duckduckgo_search import DDGS
import json

class SearchTool:
    def __init__(self):
        self.ddgs = DDGS()

    def search(self, query: str, max_results: int = 5) -> str:
        """
        Performs a web search and returns a formatted string of results.
        """
        print(f"🔎 [SEARCH] Buscando: '{query}'...")
        try:
            results = self.ddgs.text(query, max_results=max_results)
            if not results:
                return "No se encontraron resultados."
            
            formatted = []
            for r in results:
                title = r.get('title', 'Sin título')
                link = r.get('href', '#')
                body = r.get('body', '')
                formatted.append(f"- [{title}]({link}): {body}")
            
            return "\n".join(formatted)
        except Exception as e:
            return f"Error en la búsqueda: {str(e)}"

if __name__ == "__main__":
    import sys
    tool = SearchTool()
    query = sys.argv[1] if len(sys.argv) > 1 else "latest advances in local llm 2025"
    print(tool.search(query))
