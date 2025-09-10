import torch
import torch.nn.functional as F
import numpy as np
import cv2
import os
from pytorch_i3d import InceptionI3d

# --- CONFIG ---
VIDEO_PATH = '../../../backend/sample_video/00335.mp4'  # Fixed path
WEIGHTS_PATH = 'archived/asl2000/FINAL_nslt_2000_iters=5104_top1=32.48_top5=57.31_top10=66.31.pt'
NUM_CLASSES = 2000
CLASS_LIST_PATH = 'preprocess/wlasl_class_list.txt'  # Fixed path

# --- Load class list ---
with open(CLASS_LIST_PATH, 'r') as f:
    CLASS_LIST = [line.strip() for line in f.readlines()]

# --- Preprocess video ---
def load_rgb_frames_from_video(video_path, max_frames=64):
    vidcap = cv2.VideoCapture(video_path)
    frames = []
    
    # Get video properties
    total_frames = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
    
    # Calculate frame sampling
    if total_frames > max_frames:
        frame_indices = np.linspace(0, total_frames - 1, max_frames, dtype=int)
    else:
        frame_indices = range(total_frames)
    
    frame_count = 0
    while True:
        success, img = vidcap.read()
        if not success:
            break
        
        if frame_count in frame_indices:
            # Resize to 224x224
            h, w, c = img.shape
            scale = 224 / min(h, w)
            new_h, new_w = int(h * scale), int(w * scale)
            img = cv2.resize(img, (new_w, new_h))
            
            # Center crop to 224x224
            start_h = (new_h - 224) // 2
            start_w = (new_w - 224) // 2
            img = img[start_h:start_h + 224, start_w:start_w + 224]
            
            # Normalize to [-1, 1]
            img = (img / 255.0) * 2 - 1
            frames.append(img)
        
        frame_count += 1
        
        if len(frames) >= max_frames:
            break
    
    vidcap.release()
    
    if not frames:
        raise ValueError("No frames extracted from video")
    
    # Pad or truncate to max_frames
    while len(frames) < max_frames:
        frames.append(frames[-1])  # Repeat last frame
    
    frames = frames[:max_frames]
    
    # Convert to tensor: (T, H, W, C) -> (1, C, T, H, W)
    frames_array = np.asarray(frames, dtype=np.float32)
    tensor = torch.tensor(frames_array).permute(3, 0, 1, 2).unsqueeze(0)
    
    return tensor

# --- Load model ---
model = InceptionI3d(400, in_channels=3)
model.replace_logits(NUM_CLASSES)
model.load_state_dict(torch.load(WEIGHTS_PATH, map_location='cpu'))
model.eval()

# --- Run inference ---
video_tensor = load_rgb_frames_from_video(VIDEO_PATH)
with torch.no_grad():
    per_frame_logits = model(video_tensor)
    predictions = torch.max(per_frame_logits, dim=2)[0]
    probs = F.softmax(predictions, dim=1)
    top_idx = torch.argmax(probs, dim=1).item()
    confidence = probs[0, top_idx].item()

print(f"Predicted sign: {CLASS_LIST[top_idx]}")
print(f"Confidence: {confidence:.2f}") 