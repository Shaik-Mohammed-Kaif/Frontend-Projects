import os
import shutil
import glob

# Source folder (from metadata)
brain_path = r'C:\Users\Admin\.gemini\antigravity\brain\07d357a6-8702-4a2f-9032-f7f9e20551ba'
# Target folder
target_dir = r'static\images'

if not os.path.exists(target_dir):
    os.makedirs(target_dir)

# Find any logo png in brain_path
# I'll look for logo* or enhanced* or core_brain_logo*
pngs = glob.glob(os.path.join(brain_path, "*.png"))
# Sort by modification time to get the newest
pngs.sort(key=os.path.getmtime, reverse=True)

if pngs:
    newest = pngs[0]
    target_path = os.path.join(target_dir, "logo.png")
    shutil.copy2(newest, target_path)
    print(f"SUCCESS: Copied {newest} to {target_path}")
else:
    print("ERROR: No PNG found in brain directory")
