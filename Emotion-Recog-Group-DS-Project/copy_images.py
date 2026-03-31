import os
import shutil

# Paths
brain_dir = r"C:\Users\Admin\.gemini\antigravity\brain\ddca744c-84b5-4cdb-a12c-0c0caa78eb23"
static_images_dir = r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\static\images"

# Ensure target directory exists
if not os.path.exists(static_images_dir):
    os.makedirs(static_images_dir)
    print(f"Created: {static_images_dir}")

# Files to copy
files_to_copy = [
    "terms_visual_concept_1774929472355.png",
    "privacy_visual_concept_1774929492839.png"
]

for filename in files_to_copy:
    src = os.path.join(brain_dir, filename)
    dst = os.path.join(static_images_dir, filename)
    
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"Successfully copied: {filename} to {static_images_dir}")
    else:
        print(f"Error: Source file NOT found: {src}")
