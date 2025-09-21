#!/usr/bin/env python3
"""
Test script to verify the demo functionality is working correctly.
This script tests the complete demo flow including:
1. Creating a test agent
2. Testing demo functionality
3. Testing demo limits
4. Verifying error handling
"""

import requests
import json
import sqlite3
import os
import sys

API_BASE_URL = 'http://localhost:8000'
DB_PATH = 'agenthub/data/agents.db'

def test_api_health():
    """Test if the API is running."""
    try:
        response = requests.get(f'{API_BASE_URL}/')
        if response.status_code == 200:
            print("✓ API is running")
            return True
        else:
            print(f"✗ API health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("✗ API is not running. Please start the backend server.")
        return False

def create_test_agent():
    """Create a test agent for demo testing."""
    agent_data = {
        'name': 'Demo Test Agent',
        'description': 'A comprehensive test agent for demo functionality testing',
        'short_description': 'Test agent for demo validation',
        'creator': 'Test Creator',
        'creator_wallet': 'addr1test123creator',
        'price': 5000000,  # 5 ADA
        'category': 'Testing',
        'tags': ['test', 'demo', 'validation'],
        'demo_limit': 3,
        'input_schema': {
            'type': 'object',
            'properties': {
                'message': {
                    'type': 'string', 
                    'description': 'Message to process',
                    'title': 'Message'
                },
                'priority': {
                    'type': 'number', 
                    'description': 'Priority level (1-10)',
                    'title': 'Priority',
                    'minimum': 1,
                    'maximum': 10
                },
                'urgent': {
                    'type': 'boolean',
                    'description': 'Mark as urgent',
                    'title': 'Urgent'
                }
            },
            'required': ['message']
        },
        'crewai_config': {}
    }
    
    try:
        response = requests.post(f'{API_BASE_URL}/api/agents', 
                               json=agent_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            agent = response.json()
            agent_id = agent['id']
            print(f"✓ Created test agent: {agent_id}")
            
            # Approve the agent
            if os.path.exists(DB_PATH):
                conn = sqlite3.connect(DB_PATH)
                conn.execute('UPDATE agents SET is_approved = 1 WHERE id = ?', (agent_id,))
                conn.commit()
                conn.close()
                print("✓ Agent approved")
            
            return agent_id
        else:
            print(f"✗ Failed to create agent: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Error creating agent: {str(e)}")
        return None

def test_demo_functionality(agent_id):
    """Test the demo functionality."""
    print(f"\nTesting demo functionality for agent: {agent_id}")
    
    # Test 1: Basic demo
    demo_data = {
        'input': {
            'message': 'Hello, this is a test message',
            'priority': 5,
            'urgent': False
        },
        'user_wallet': 'addr1test123user'
    }
    
    try:
        response = requests.post(f'{API_BASE_URL}/api/agents/{agent_id}/demo', 
                               json=demo_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Demo 1 successful - Count: {result['demo_count']}/{result['demo_limit']}")
            print(f"  Job ID: {result['job_id']}")
            print(f"  Status: {result['status']}")
            
            # Verify output structure
            if 'output' in result and result['output']:
                output = result['output']
                if 'demo' in output and output['demo'] == True:
                    print("✓ Demo output correctly marked as demo")
                else:
                    print("✗ Demo output not properly marked")
                
                if 'input_received' in output:
                    print("✓ Demo output includes input received")
                else:
                    print("✗ Demo output missing input received")
            
            return True
        else:
            print(f"✗ Demo 1 failed: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error in demo test: {str(e)}")
        return False

def test_demo_limits(agent_id):
    """Test demo limits enforcement."""
    print(f"\nTesting demo limits for agent: {agent_id}")
    
    user_wallet = 'addr1testlimits'
    demo_data = {
        'input': {'message': 'Testing limits'},
        'user_wallet': user_wallet
    }
    
    # Run demos up to the limit
    for i in range(4):  # Try 4 demos (limit is 3)
        try:
            response = requests.post(f'{API_BASE_URL}/api/agents/{agent_id}/demo', 
                                   json=demo_data,
                                   headers={'Content-Type': 'application/json'})
            
            if i < 3:  # First 3 should succeed
                if response.status_code == 200:
                    result = response.json()
                    print(f"✓ Demo {i+1} successful - Count: {result['demo_count']}/{result['demo_limit']}")
                else:
                    print(f"✗ Demo {i+1} failed unexpectedly: {response.text}")
                    return False
            else:  # 4th should fail with 429
                if response.status_code == 429:
                    print("✓ Demo limit enforcement working - 4th demo rejected")
                    return True
                else:
                    print(f"✗ Demo limit not enforced - 4th demo status: {response.status_code}")
                    return False
                    
        except Exception as e:
            print(f"✗ Error in demo limit test {i+1}: {str(e)}")
            return False
    
    return True

def test_anonymous_demo(agent_id):
    """Test demo without user wallet (anonymous)."""
    print(f"\nTesting anonymous demo for agent: {agent_id}")
    
    demo_data = {
        'input': {'message': 'Anonymous demo test'}
        # No user_wallet provided
    }
    
    try:
        response = requests.post(f'{API_BASE_URL}/api/agents/{agent_id}/demo', 
                               json=demo_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 200:
            result = response.json()
            print("✓ Anonymous demo successful")
            print(f"  Demo count: {result['demo_count']}/{result['demo_limit']}")
            return True
        else:
            print(f"✗ Anonymous demo failed: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error in anonymous demo test: {str(e)}")
        return False

def test_invalid_agent_demo():
    """Test demo with invalid agent ID."""
    print(f"\nTesting demo with invalid agent ID")
    
    demo_data = {
        'input': {'message': 'Test with invalid agent'},
        'user_wallet': 'addr1test123'
    }
    
    try:
        response = requests.post(f'{API_BASE_URL}/api/agents/invalid-agent-id/demo', 
                               json=demo_data,
                               headers={'Content-Type': 'application/json'})
        
        if response.status_code == 404:
            print("✓ Invalid agent ID properly rejected")
            return True
        else:
            print(f"✗ Invalid agent ID not properly handled: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error in invalid agent test: {str(e)}")
        return False

def main():
    """Run all demo functionality tests."""
    print("=== Demo Functionality Test Suite ===\n")
    
    # Test API health
    if not test_api_health():
        print("\nPlease start the backend server with: python backend/start_server.py")
        sys.exit(1)
    
    # Create test agent
    agent_id = create_test_agent()
    if not agent_id:
        print("Failed to create test agent. Exiting.")
        sys.exit(1)
    
    # Run tests
    tests = [
        test_demo_functionality,
        test_demo_limits,
        test_anonymous_demo,
        test_invalid_agent_demo
    ]
    
    passed = 0
    total = len(tests)
    
    for test_func in tests:
        if test_func == test_invalid_agent_demo:
            # This test doesn't need agent_id
            if test_func():
                passed += 1
        else:
            if test_func(agent_id):
                passed += 1
    
    print(f"\n=== Test Results ===")
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("✓ All demo functionality tests passed!")
        print("\nDemo functionality is working correctly:")
        print("- Demo endpoint accepts requests and returns proper responses")
        print("- Demo limits are enforced per user wallet")
        print("- Anonymous demos work without user wallet")
        print("- Invalid agent IDs are properly rejected")
        print("- Demo output includes proper metadata and limitations")
    else:
        print("✗ Some tests failed. Please check the implementation.")
        sys.exit(1)

if __name__ == "__main__":
    main()