#!/usr/bin/env python3
"""
Standalone inference module for sign language recognition.
This module can be imported by the backend to run model inference.
"""

import torch
import torch.nn.functional as F
import numpy as np
import cv2
import os
import sys
from pathlib import Path
from typing import Dict, List, Optional
import logging

# Add the I3D code path
current_dir = Path(__file__).parent
i3d_path = current_dir / "code" / "I3D"
sys.path.append(str(i3d_path))

from pytorch_i3d import InceptionI3d

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SignLanguageInference:
    def __init__(self, model_size: str = "2000"):
        """
        Initialize the sign language inference model.
        
        Args:
            model_size: Size of the model ("100", "300", "1000", or "2000")
        """
        self.model_size = model_size
        self.num_classes = int(model_size)
        self.model = None
        self.class_list = []
        # Prefer CUDA if available; otherwise CPU
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Paths
        self.base_path = current_dir
        # Resolve weights path dynamically to avoid hardcoding a single filename per size
        self.weights_path = self._resolve_weights_path()
        self.class_list_path = self.base_path / "code" / "I3D" / "preprocess" / "wlasl_class_list.txt"
        
        self._load_model()
        self._load_class_list()
    
    def _load_model(self):
        """Load the pre-trained I3D model."""
        try:
            logger.info(f"Loading I3D model from {self.weights_path}")
            
            # Initialize model
            self.model = InceptionI3d(400, in_channels=3)
            self.model.replace_logits(self.num_classes)
            
            # Load pre-trained weights if available; otherwise proceed with random weights
            if self.weights_path and self.weights_path.exists():
                try:
                    self.model.load_state_dict(torch.load(self.weights_path, map_location=self.device))
                    logger.info("Model weights loaded successfully")
                except Exception as load_err:
                    logger.warning(f"Failed to load weights from {self.weights_path}: {load_err}. Proceeding with randomly initialized weights.")
            else:
                logger.warning(f"Weights file not found at {self.weights_path}. Proceeding with randomly initialized weights.")

            self.model.to(self.device)
            self.model.eval()
            logger.info(f"Model loaded successfully on {self.device}")
            
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            raise

    def _resolve_weights_path(self) -> Optional[Path]:
        """
        Dynamically resolve the best weights file for the given model size.

        Priority:
        1) Files containing "FINAL" in name
        2) Most recent .pt file in directory
        """
        try:
            weights_dir = self.base_path / "code" / "I3D" / "archived" / f"asl{self.model_size}"
            if not weights_dir.exists():
                logger.warning(f"Weights directory not found: {weights_dir}")
                return None

            pt_files = sorted(list(weights_dir.glob("*.pt")), key=lambda p: p.stat().st_mtime, reverse=True)
            if not pt_files:
                logger.warning(f"No .pt weight files found in {weights_dir}")
                return None

            # Prefer any file with "FINAL" in its name; otherwise use the most recent
            final_candidates = [p for p in pt_files if "FINAL" in p.name.upper()]
            chosen = final_candidates[0] if final_candidates else pt_files[0]
            logger.info(f"Resolved weights file: {chosen}")
            return chosen
        except Exception as e:
            logger.warning(f"Failed to resolve weights path: {e}")
            return None
    
    def _load_class_list(self):
        """Load the class list for mapping predictions to ASL words."""
        try:
            if self.class_list_path.exists():
                parsed: List[str] = []
                with open(self.class_list_path, 'r') as f:
                    for raw in f.readlines():
                        line = raw.strip()
                        if not line:
                            continue
                        # Expected format: "<index>\t<label>". Keep label only.
                        # Some labels contain spaces, so split once.
                        parts = line.split(None, 1)
                        if len(parts) == 2:
                            parsed.append(parts[1])
                        else:
                            parsed.append(parts[0])
                self.class_list = parsed
                logger.info(f"Loaded {len(self.class_list)} classes")
            else:
                logger.warning(f"Class list file not found at {self.class_list_path}")
                # Fallback to generic class names
                self.class_list = [f"sign_{i}" for i in range(self.num_classes)]
        except Exception as e:
            logger.error(f"Error loading class list: {e}")
            self.class_list = [f"sign_{i}" for i in range(self.num_classes)]
    
    def preprocess_video(self, video_path: str, max_frames: int = 64) -> torch.Tensor:
        """
        Preprocess video for model inference.
        
        Args:
            video_path: Path to the video file
            max_frames: Maximum number of frames to extract
            
        Returns:
            Preprocessed video tensor
        """
        try:
            # For some webm encodings, OpenCV may need ffmpeg backend
            vidcap = cv2.VideoCapture(video_path)
            if not vidcap.isOpened():
                raise ValueError(f"Unable to open video file: {video_path}")
            frames = []
            
            # Get video properties
            fps = vidcap.get(cv2.CAP_PROP_FPS)
            total_frames = int(vidcap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Determine uniform frame indices across the entire clip
            if total_frames > 0:
                if total_frames >= max_frames:
                    frame_indices = np.linspace(0, total_frames - 1, max_frames, dtype=int)
                else:
                    frame_indices = np.arange(total_frames, dtype=int)
            else:
                frame_indices = np.arange(max_frames, dtype=int)

            # Try random-access sampling; if it fails, fallback to sequential sampling
            def _read_frame_at(index: int):
                if index != int(vidcap.get(cv2.CAP_PROP_POS_FRAMES)):
                    vidcap.set(cv2.CAP_PROP_POS_FRAMES, index)
                ok, frame = vidcap.read()
                return ok, frame

            for idx in frame_indices:
                ok, img = _read_frame_at(int(idx))
                if not ok:
                    # Fallback: read sequentially
                    ok_seq, img = vidcap.read()
                    if not ok_seq:
                        break

                # Resize to 224x224
                h, w, c = img.shape if len(img.shape) == 3 else (img.shape[0], img.shape[1], 1)
                scale = 224 / min(h, w)
                new_h, new_w = int(h * scale), int(w * scale)
                img = cv2.resize(img, (new_w, new_h))

                # Center crop to 224x224
                start_h = (new_h - 224) // 2
                start_w = (new_w - 224) // 2
                img = img[start_h:start_h + 224, start_w:start_w + 224]

                # Ensure 3 channels (RGB)
                if len(img.shape) == 2 or (len(img.shape) == 3 and img.shape[2] == 1):
                    img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
                else:
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

                # Normalize to [-1, 1]
                img = (img.astype(np.float32) / 255.0) * 2 - 1
                frames.append(img)

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
            frames_array = np.ascontiguousarray(frames_array)
            tensor = torch.from_numpy(frames_array).permute(3, 0, 1, 2).unsqueeze(0)
            
            logger.info(f"Preprocessed video: {tensor.shape}")
            return tensor
            
        except Exception as e:
            logger.error(f"Error preprocessing video: {e}")
            raise
    
    def predict(self, video_path: str, top_k: int = 5) -> Dict:
        """
        Run inference on a video file.
        
        Args:
            video_path: Path to the video file
            top_k: Number of top predictions to return
            
        Returns:
            Dictionary containing predictions and metadata
        """
        try:
            if self.model is None:
                raise ValueError("Model not loaded")
            
            # Preprocess video
            video_tensor = self.preprocess_video(video_path)
            video_tensor = video_tensor.to(self.device)
            
            # Run inference
            with torch.no_grad():
                per_frame_logits = self.model(video_tensor)
                # Aggregate temporal logits by mean for stability
                predictions = torch.mean(per_frame_logits, dim=2)
                probs = F.softmax(predictions, dim=1)
                
                # Get top-k predictions
                top_probs, top_indices = torch.topk(probs, top_k, dim=1)
                
                # Convert to lists
                top_probs = top_probs.cpu().numpy()[0]
                top_indices = top_indices.cpu().numpy()[0]
                
                # Get predicted words
                predicted_words = []
                for i, (prob, idx) in enumerate(zip(top_probs, top_indices)):
                    if idx < len(self.class_list):
                        word = self.class_list[idx]
                    else:
                        word = f"unknown_{idx}"
                    
                    predicted_words.append({
                        "text": word,
                        "confidence": float(prob)
                    })
                
                # Main prediction
                main_prediction = predicted_words[0]
                
                result = {
                    "text": main_prediction["text"],
                    "confidence": main_prediction["confidence"],
                    "alternatives": predicted_words[1:],
                    "model_info": {
                        "model_size": self.model_size,
                        "num_classes": self.num_classes,
                        "device": str(self.device)
                    }
                }
                
                logger.info(f"Prediction: {main_prediction['text']} (confidence: {main_prediction['confidence']:.3f})")
                return result
                
        except Exception as e:
            logger.error(f"Error during inference: {e}")
            raise

# Global model instances, cached per model size
_model_instances: Dict[str, SignLanguageInference] = {}

def get_model(model_size: str = "2000") -> SignLanguageInference:
    """Get or create a model instance for the given size."""
    global _model_instances
    instance = _model_instances.get(model_size)
    if instance is None:
        instance = SignLanguageInference(model_size)
        _model_instances[model_size] = instance
    return instance

def run_inference(video_path: str, model_size: str = "2000") -> Dict:
    """
    Run sign language inference on a video file.
    
    Args:
        video_path: Path to the video file
        model_size: Size of the model to use
        
    Returns:
        Dictionary containing prediction results
    """
    try:
        model = get_model(model_size)
        result = model.predict(video_path)
        return result
        
    except Exception as e:
        logger.error(f"Inference failed: {e}")
        # Return a fallback result
        return {
            "text": "Unable to process video",
            "confidence": 0.0,
            "alternatives": [],
            "error": str(e)
        }

if __name__ == "__main__":
    # Test the inference module
    import argparse
    
    parser = argparse.ArgumentParser(description="Sign Language Inference Test")
    parser.add_argument("video_path", help="Path to video file")
    parser.add_argument("--model_size", default="2000", choices=["100", "300", "1000", "2000"], 
                       help="Model size to use")
    
    args = parser.parse_args()
    
    result = run_inference(args.video_path, args.model_size)
    print(f"Prediction: {result.get('text', 'N/A')}")
    print(f"Confidence: {result.get('confidence', 0.0):.3f}")
    if 'model_info' in result:
        print(f"Model Info: {result['model_info']}")
    if 'error' in result:
        print(f"Error: {result['error']}")