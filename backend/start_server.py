"""
Start the FastAPI server for development and testing.
"""

import subprocess
import sys
import time
import signal
import os

def kill_existing_servers():
    """Kill any existing FastAPI servers running on port 8000."""
    try:
        # On Windows, use taskkill to find and kill processes using port 8000
        if os.name == 'nt':
            subprocess.run(['taskkill', '/F', '/IM', 'python.exe'], 
                         capture_output=True, check=False)
        else:
            # On Unix-like systems
            subprocess.run(['pkill', '-f', 'uvicorn.*main:app'], 
                         capture_output=True, check=False)
        time.sleep(1)
    except Exception as e:
        print(f"Note: Could not kill existing servers: {e}")

def start_server():
    """Start the FastAPI server."""
    print("Starting AgentHub FastAPI server...")
    print("Server will be available at: http://localhost:8000")
    print("API documentation at: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    print("-" * 50)
    
    try:
        # Start the server
        subprocess.run([
            sys.executable, '-m', 'uvicorn', 
            'main:app', 
            '--host', '0.0.0.0', 
            '--port', '8000', 
            '--reload'
        ])
    except KeyboardInterrupt:
        print("\nShutting down server...")
    except Exception as e:
        print(f"Error starting server: {e}")

if __name__ == "__main__":
    kill_existing_servers()
    start_server()