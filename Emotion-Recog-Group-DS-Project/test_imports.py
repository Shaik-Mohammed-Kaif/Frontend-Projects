import sys
import os
sys.path.append(os.getcwd())

try:
    from routes.additional_features import additional_bp
    print("SUCCESS: routes.additional_features imported")
except ImportError as e:
    print(f"FAILED: {e}")

try:
    from app import app
    print("SUCCESS: app.py imported")
except Exception as e:
    print(f"FAILED to import app: {e}")
