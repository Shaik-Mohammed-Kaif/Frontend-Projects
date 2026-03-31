import os

files_to_remove = [
    r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\routes\image_routes.py",
    r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\image_module.py",
    r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\templates\image_module.html",
    r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\templates\image_analysis.html",
    r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\services\image_service.py"
]

for f in files_to_remove:
    if os.path.exists(f):
        try:
            os.remove(f)
            print(f"Removed: {f}")
        except Exception as e:
            print(f"Error removing {f}: {e}")
    else:
        print(f"Not found: {f}")
