"""
Autopoiesis Agent (161914)
Agent dedicated to monitoring system health and self-improvement.
Implements AGI-inspired self-reflection and task analysis.
"""
import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime

# Initialize optional dependencies
load_scroll = None
list_available_scrolls = None
reflect_on_plan = None
check_for_errors = None

try:
    from systems.FOUNDATION.anuu_core.scroll_loader import load_scroll, list_available_scrolls
    from systems.EXECUTION.agents.omnitool.ace_router import reflect_on_plan, check_for_errors
except ImportError as e:
    print(f"[AUTOPOIESIS ERROR] Import failed: {e}")
    # Continue with None values, functionalities will be disabled


class AutopoiesisAgent:
    """
    The Autopoiesis Agent monitors the Anuu system's health,
    tracks task progress, and suggests improvements.
    """
    
    def __init__(self, task_file_path: Optional[str] = None):
        self.name = "Autopoiesis-161914"
        self.task_file = task_file_path
        self.health_status = {
            "last_check": None,
            "errors_detected": [],
            "suggestions": [],
            "task_progress": {}
        }
    
    def check_system_health(self) -> Dict[str, Any]:
        """
        Performs a health check on the Anuu system.
        Checks for available scrolls, recent errors, etc.
        """
        health = {
            "timestamp": datetime.now().isoformat(),
            "scrolls_available": len(list_available_scrolls()) if list_available_scrolls else 0,
            "status": "healthy",
            "issues": []
        }
        
        # Check if critical scrolls exist
        critical_scrolls = ["anuu_core", "kilonova", "libra"]
        for scroll_name in critical_scrolls:
            try:
                scroll = load_scroll(scroll_name) if load_scroll else None
                if not scroll or scroll.get("archetype_id") == "default":
                    health["issues"].append(f"Missing critical scroll: {scroll_name}")
            except Exception as e:
                health["issues"].append(f"Error loading scroll {scroll_name}: {str(e)}")
        
        if health["issues"]:
            health["status"] = "degraded" if len(health["issues"]) < 3 else "critical"
        
        self.health_status["last_check"] = health["timestamp"]
        return health
    
    def analyze_task_progress(self, task_content: str) -> Dict[str, Any]:
        """
        Analyzes task.md content to determine progress and suggest next actions.
        """
        lines = task_content.strip().split("\n")
        completed = 0
        in_progress = 0
        pending = 0
        tasks = []
        
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("- [x]"):
                completed += 1
                tasks.append({"text": stripped[6:], "status": "completed"})
            elif stripped.startswith("- [/]"):
                in_progress += 1
                tasks.append({"text": stripped[6:], "status": "in_progress"})
            elif stripped.startswith("- [ ]"):
                pending += 1
                tasks.append({"text": stripped[6:], "status": "pending"})
        
        total = completed + in_progress + pending
        progress_pct = (completed / total * 100) if total > 0 else 0
        
        analysis = {
            "total_tasks": total,
            "completed": completed,
            "in_progress": in_progress,
            "pending": pending,
            "progress_percentage": round(progress_pct, 1),
            "tasks": tasks
        }
        
        self.health_status["task_progress"] = analysis
        return analysis
    
    def suggest_next_action(self, context: str = "") -> str:
        """
        Based on current system state and context, suggests the next action.
        """
        # Check for errors in context
        errors = check_for_errors(context) if check_for_errors else []
        
        if errors:
            return f"[AUTOPOIESIS] Errors detected: {errors}. Recommend retry or escalation."
        
        if self.health_status.get("task_progress", {}).get("pending", 0) > 0:
            pending_tasks = [t for t in self.health_status.get("task_progress", {}).get("tasks", []) 
                          if t.get("status") == "pending"]
            if pending_tasks:
                return f"[AUTOPOIESIS] Next recommended task: {pending_tasks[0].get('text', 'Unknown')}"
        
        return "[AUTOPOIESIS] All systems nominal. Awaiting user directive."
    
    def generate_report(self) -> str:
        """
        Generates a markdown report of the system's current state.
        """
        health = self.check_system_health()
        
        report = f"""# Autopoiesis Report - {health['timestamp']}

## System Health: {health['status'].upper()}

### Scrolls Available: {health['scrolls_available']}

### Issues Detected:
"""
        if health['issues']:
            for issue in health['issues']:
                report += f"- ⚠️ {issue}\n"
        else:
            report += "- ✅ No issues detected\n"
        
        # Add task progress if available
        if self.health_status.get("task_progress"):
            tp = self.health_status["task_progress"]
            report += f"""
## Task Progress: {tp['progress_percentage']}%
- Completed: {tp['completed']}
- In Progress: {tp['in_progress']}
- Pending: {tp['pending']}
"""
        
        return report


# Singleton instance for easy access
_agent_instance = None

def get_autopoiesis_agent() -> AutopoiesisAgent:
    """Returns the singleton Autopoiesis Agent instance."""
    global _agent_instance
    if _agent_instance is None:
        _agent_instance = AutopoiesisAgent()
    return _agent_instance
