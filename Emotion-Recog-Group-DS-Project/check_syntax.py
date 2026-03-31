import sys
try:
    import core.webcam_engine
    print("Syntax OK")
except Exception as e:
    print(f"Syntax Error: {e}")
    sys.exit(1)
