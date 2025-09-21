"""
Simple test script to verify the AgentHub API endpoints.
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def test_health_check():
    """Test the root health check endpoint."""
    print("Testing health check...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    return response.status_code == 200

def test_list_agents():
    """Test listing agents."""
    print("\nTesting list agents...")
    response = requests.get(f"{BASE_URL}/api/agents")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        agents = response.json()
        print(f"Found {len(agents)} agents")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_create_agent():
    """Test creating a new agent."""
    print("\nTesting create agent...")
    
    agent_data = {
        "name": "Test Agent",
        "description": "A test agent for API validation",
        "short_description": "Test agent for validation",
        "creator": "Test Creator",
        "creator_wallet": "addr_test1234567890abcdef",
        "price": 1000000,  # 1 ADA in lovelace
        "category": "utility",
        "tags": ["test", "demo"],
        "avatar": "https://example.com/avatar.png",
        "demo_limit": 3,
        "input_schema": {
            "type": "object",
            "properties": {
                "message": {"type": "string"}
            }
        },
        "crewai_config": {
            "role": "assistant",
            "goal": "Help users with tasks"
        }
    }
    
    response = requests.post(
        f"{BASE_URL}/api/agents",
        json=agent_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        agent = response.json()
        print(f"Created agent: {agent['name']} (ID: {agent['id']})")
        return agent['id']
    else:
        print(f"Error: {response.text}")
        return None

def test_get_agent(agent_id):
    """Test getting a specific agent."""
    print(f"\nTesting get agent {agent_id}...")
    response = requests.get(f"{BASE_URL}/api/agents/{agent_id}")
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        agent = response.json()
        print(f"Retrieved agent: {agent['name']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_get_nonexistent_agent():
    """Test getting a non-existent agent."""
    print("\nTesting get non-existent agent...")
    response = requests.get(f"{BASE_URL}/api/agents/nonexistent-id")
    print(f"Status: {response.status_code}")
    if response.status_code == 404:
        print("Correctly returned 404 for non-existent agent")
        return True
    else:
        print(f"Unexpected response: {response.text}")
        return False

def run_all_tests():
    """Run all API tests."""
    print("Starting AgentHub API tests...")
    print("=" * 50)
    
    tests_passed = 0
    total_tests = 5
    
    # Test health check
    if test_health_check():
        tests_passed += 1
    
    # Test list agents (should work even with empty database)
    if test_list_agents():
        tests_passed += 1
    
    # Test create agent
    agent_id = test_create_agent()
    if agent_id:
        tests_passed += 1
        
        # Test get specific agent
        if test_get_agent(agent_id):
            tests_passed += 1
    else:
        print("Skipping get agent test due to create failure")
    
    # Test get non-existent agent
    if test_get_nonexistent_agent():
        tests_passed += 1
    
    print("\n" + "=" * 50)
    print(f"Tests completed: {tests_passed}/{total_tests} passed")
    
    if tests_passed == total_tests:
        print("All tests passed! ✅")
    else:
        print("Some tests failed! ❌")

if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the API server.")
        print("Make sure the FastAPI server is running on http://localhost:8000")
        print("Run: python run.py")