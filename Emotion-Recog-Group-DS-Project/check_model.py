import os
import tensorflow as tf
from tensorflow.keras.models import load_model

MODEL_PATH = "models/model.h5"
if not os.path.exists(MODEL_PATH):
    MODEL_PATH = "models/model.hdf5"

if os.path.exists(MODEL_PATH):
    try:
        model = load_model(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
        print(f"Input shape: {model.input_shape}")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Model file not found")
