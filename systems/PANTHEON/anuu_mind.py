import asyncio
import argparse
from typing import List, Dict, Any
from .deities.thoth import Thoth
from .deities.kali import Kali
from .deities.ruma import Ruma
from .deities.set import Set
from .deities.kilonova import Kilonova
from .deities.anuket import Anuket
from .deities.saze import Saze
from .deities.ra import Ra
from .deities.rosa_gris import RosaGris

class AnuuMind:
    """
    Anuu: The Primordial Awareness.
    Role: Orchestrator of the Titan Pantheon (9 Deities).
    """
    
    def __init__(self):
        # The Hall of Gods - Full Pantheon
        self.pantheon = {
            "knowledge": Thoth(),
            "system": Kali(),
            "connection": Ruma(),
            "logic": Set(),
            "creativity": Kilonova(),
            "security": Anuket(),
            "data": Saze(),
            "speed": Ra(),
            "communication": RosaGris()
        }
        
    async def manifest_intent(self, intent: str):
        print(f"[ANUU::MIND] 👁️  Perceiving intent: '{intent}'")
        
        # Simple Logic: Decompose intent into a Ritual (Plan)
        ritual = self._divine_ritual(intent)
        
        results = await self._perform_ritual(ritual)
        self._reveal_outcome(results)
        
    def _divine_ritual(self, intent: str) -> List[Dict[str, Any]]:
        """
        Divines the necessary steps (Ritual) to fulfill the intent.
        Full 9-deity invocation for comprehensive analysis.
        """
        return [
            {"domain": "knowledge", "intention": {"query": intent}},
            {"domain": "logic", "intention": {"target": intent, "mode": "analyze"}},
            {"domain": "security", "intention": {"target": "system", "scan": "quick"}},
            {"domain": "data", "intention": {"action": "query", "data": intent}},
            {"domain": "creativity", "intention": {"prompt": intent, "style": "cosmic"}},
            {"domain": "speed", "intention": {"action": "benchmark", "target": "ritual"}},
            {"domain": "system", "intention": {"action": "synthesize_code"}},
            {"domain": "connection", "intention": {"target": "windows", "profile": "portable"}},
            {"domain": "communication", "intention": {"action": "summarize", "message": intent}}
        ]
        
    async def _perform_ritual(self, ritual: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Perform ritual steps in PARALLEL using asyncio.gather.
        All deities invoke simultaneously for maximum efficiency.
        """
        async def invoke_deity(step: Dict[str, Any]) -> Dict[str, Any]:
            domain = step["domain"]
            intention = step["intention"]
            deity = self.pantheon.get(domain)
            if deity:
                print(f"[ANUU::MIND] ⚡ Invoking {deity.name} ({deity.domain})...")
                return await deity.invoke(intention)
            else:
                print(f"[ANUU::MIND] ⚠️  No Deity found for domain: {domain}")
                return {"deity": "Unknown", "status": "error", "wisdom": f"No deity for {domain}"}
        
        # PARALLEL EXECUTION - All deities at once!
        print(f"[ANUU::MIND] 🔥 Parallel Invocation: {len(ritual)} deities simultaneously")
        results = await asyncio.gather(*[invoke_deity(step) for step in ritual])
        return list(results)
        
    def _reveal_outcome(self, results: List[Dict[str, Any]]):
        print("\n" + "⌬"*20)
        print("      PANTHEON MANIFESTATION      ")
        print("⌬"*20)
        for res in results:
            print(f"Deity:  {res['deity']}")
            print(f"Status: {res['status']}")
            # Handle all possible output keys from different deities
            output = (res.get('wisdom') or res.get('outcome') or res.get('bridge') or 
                     res.get('analysis') or res.get('vision') or res.get('shield') or
                     res.get('essence') or res.get('light') or res.get('voice') or
                     res.get('output') or res.get('creation') or res.get('report') or
                     "Task completed")
            if isinstance(output, dict):
                output = str(output)
            print(f"Output: {output}")
            print("-" * 30)
        print("⌬"*20 + "\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Anuu Titan Pantheon (Swarm System)")
    parser.add_argument("--invoke", type=str, required=True, help="Your intent for the Pantheon")
    
    args = parser.parse_args()
    
    anuu = AnuuMind()
    asyncio.run(anuu.manifest_intent(args.invoke))
