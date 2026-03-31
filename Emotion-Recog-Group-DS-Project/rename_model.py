import os
old_path = r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\models\model.hdf5"
new_path = r"d:\Emotion Recognition\Industry-Level-Flask-Emotion-Proj\models\emotion_cnn.hdf5"
if os.path.exists(old_path):
    os.rename(old_path, new_path)
    print("Renamed model.hdf5 to emotion_cnn.hdf5")
else:
    print("model.hdf5 not found")
