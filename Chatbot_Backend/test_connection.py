#!/usr/bin/env python3
"""
Simple test script to verify chatbot connection
"""

import requests
import json

def test_chatbot_connection(base_url):
    """Test chatbot connection and functionality"""
    
    print(f"Testing chatbot at: {base_url}")
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/api/health")
        print(f"Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Health check failed: {e}")
        return False
    
    # Test 2: Root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"Root endpoint failed: {e}")
    
    # Test 3: Chat endpoint
    try:
        test_query = {"query": "What is health insurance?"}
        response = requests.post(
            f"{base_url}/api/chat",
            json=test_query,
            headers={"Content-Type": "application/json"}
        )
        print(f"Chat test: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Response: {result}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Chat test failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    # Replace with your actual Render URL
    render_url = "https://your-chatbot-service.onrender.com"
    
    print("Testing chatbot connection...")
    success = test_chatbot_connection(render_url)
    
    if success:
        print("✅ Chatbot is working correctly!")
    else:
        print("❌ Chatbot has issues") 