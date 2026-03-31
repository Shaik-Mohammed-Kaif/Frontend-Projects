import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, BatchNormalization, Activation, MaxPooling2D, Dropout, GlobalAveragePooling2D, Dense
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import numpy as np
import cv2
import os

# --- MODEL ARCHITECTURE (Industry Standard for 48x48) ---
def build_advanced_cnn(input_shape=(48, 48, 1), num_classes=7):
    model = Sequential()

    # Block 1
    model.add(Conv2D(64, (3, 3), padding='same', input_shape=input_shape))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(Conv2D(64, (3, 3), padding='same'))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # Block 2
    model.add(Conv2D(128, (3, 3), padding='same'))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(Conv2D(128, (3, 3), padding='same'))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # Block 3
    model.add(Conv2D(256, (3, 3), padding='same'))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(Conv2D(256, (3, 3), padding='same'))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # Block 4
    model.add(Conv2D(512, (3, 3), padding='same'))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    # Global Average Pooling and Dense Layers
    model.add(GlobalAveragePooling2D())
    model.add(Dense(512))
    model.add(BatchNormalization())
    model.add(Activation('relu'))
    model.add(Dropout(0.5))
    
    model.add(Dense(num_classes, activation='softmax'))

    return model

# --- DATASET PREPROCESSING ---
def get_datagen():
    return ImageDataGenerator(
        rescale=1./255,
        rotation_range=15,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        fill_mode='nearest'
    )

# --- TRAINING PIPELINE ---
def train_model(train_dir, val_dir):
    print("🚀 Initializing Industry-Level Training Pipeline...")
    
    # Hyperparameters
    BATCH_SIZE = 64
    EPOCHS = 100
    LR = 0.0001
    
    datagen = get_datagen()
    
    train_generator = datagen.flow_from_directory(
        train_dir,
        target_size=(48, 48),
        color_mode='grayscale',
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        shuffle=True
    )
    
    val_generator = ImageDataGenerator(rescale=1./255).flow_from_directory(
        val_dir,
        target_size=(48, 48),
        color_mode='grayscale',
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    # Class weights for balancing
    from sklearn.utils import class_weight
    labels_dict = train_generator.class_indices
    classes = list(labels_dict.values())
    y_train = train_generator.classes
    weights = class_weight.compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
    class_weights = dict(enumerate(weights))
    
    model = build_advanced_cnn()
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LR),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # Callbacks
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=15, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5, min_lr=0.00001, verbose=1),
        ModelCheckpoint('model.h5', monitor='val_accuracy', save_best_only=True, mode='max', verbose=1)
    ]
    
    print("🔥 Starting Training...")
    history = model.fit(
        train_generator,
        steps_per_epoch=train_generator.samples // BATCH_SIZE,
        epochs=EPOCHS,
        validation_data=val_generator,
        validation_steps=val_generator.samples // BATCH_SIZE,
        callbacks=callbacks,
        class_weight=class_weights
    )
    
    print("✅ Model trained and saved as model.h5")
    return history

if __name__ == "__main__":
    # Assuming dataset is in a standard FER structure
    # train_dir = 'path/to/fer2013/train'
    # val_dir = 'path/to/fer2013/test'
    # train_model(train_dir, val_dir)
    print("Please provide paths to your training and validation directories in the script.")
