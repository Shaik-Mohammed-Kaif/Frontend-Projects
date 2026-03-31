try:
    import mediapipe as mp
    print(f"✅ MediaPipe found: {mp.__version__}")
except ImportError:
    print("❌ MediaPipe not found")

import cv2
print(f"✅ OpenCV version: {cv2.__version__}")
