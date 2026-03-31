try:
    import deepface
    from deepface import DeepFace
    print("SUCCESS: DeepFace imported")
except ImportError as e:
    print(f"FAILED: {e}")

try:
    import requests
    print("SUCCESS: requests imported")
except ImportError as e:
    print(f"FAILED: {e}")

try:
    from modules.image_module import image_bp
    print("SUCCESS: modules.image_module imported")
except Exception as e:
    print(f"FAILED to import image_module: {e}")
