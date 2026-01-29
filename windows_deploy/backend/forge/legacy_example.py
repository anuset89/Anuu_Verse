"""
Example legacy code for Forge demonstration.
This intentionally has issues that Forge will fix.
"""

import requests
import json


def fetch_user_data(user_id):
    url = f"https://api.example.com/users/{user_id}"
    response = requests.get(url)
    data = json.loads(response.text)
    return data


def process_users(user_ids):
    results = []
    for uid in user_ids:
        try:
            user = fetch_user_data(uid)
            if user['active']:
                results.append(user)
        except:
            pass
    return results


def calculate_stats(users):
    total = 0
    active = 0
    for user in users:
        total = total + 1
        if user.get('active'):
            active = active + 1
    
    if total > 0:
        percentage = (active / total) * 100
    else:
        percentage = 0
    
    return {
        'total': total,
        'active': active,
        'percentage': percentage
    }


class UserManager:
    def __init__(self):
        self.users = []
    
    def add_user(self, user):
        self.users.append(user)
    
    def get_user(self, user_id):
        for user in self.users:
            if user['id'] == user_id:
                return user
        return None
    
    def remove_inactive(self):
        active_users = []
        for user in self.users:
            if user.get('active', False):
                active_users.append(user)
        self.users = active_users
