#!/usr/bin/env python3
"""
Test script for sign language inference.
This script tests the model inference with the sample video.
"""

import sys
import os
from pathlib import Path

# Add the app directory to the path
sys.path.append(str(Path(__file__).parent / "app"))

from model import run_inference

def test_model_setup():
    """Test if the model environment is properly set up."""
    print("Testing model setup...")
    try:
        # Check if model environment is available
        model_dir = Path(__file__).parent.parent / "model"
        model_venv_python = model_dir / ".venv" / "Scripts" / "python.exe"
        inference_script = model_dir / "inference_module.py"
        
        if not model_venv_python.exists():
            print(f"✗ Model venv not found at {model_venv_python}")
            return False
        
        if not inference_script.exists():
            print(f"✗ Inference script not found at {inference_script}")
            return False
        
        print("✓ Model environment is properly set up")
        print(f"  - Model venv: {model_venv_python}")
        print(f"  - Inference script: {inference_script}")
        return True
        
    except Exception as e:
        print(f"✗ Model setup test failed: {e}")
        return False

def test_video_inference():
    """Test video inference with sample video."""
    print("\nTesting video inference...")
    
    # Check if sample video exists
    sample_video_path = Path(__file__).parent / "sample_video" / "00583.mp4"
    if not sample_video_path.exists():
        print(f"✗ Sample video not found at {sample_video_path}")
        return False
    
    try:
        print(f"Processing video: {sample_video_path}")
        result = run_inference(str(sample_video_path), "2000")
        
        print("✓ Inference completed successfully")
        print(f"  - Detected text: {result['text']}")
        print(f"  - Confidence: {result['confidence']:.3f}")
        print(f"  - Model info: {result.get('model_info', {})}")
        
        if result.get('error'):
            print(f"  - Error: {result['error']}")
            return False
        
        return True
        
    except Exception as e:
        print(f"✗ Video inference failed: {e}")
        return False

def test_different_model_sizes():
    """Test different model sizes."""
    print("\nTesting different model sizes...")
    
    sample_video_path = Path(__file__).parent / "sample_video" / "00583.mp4"
    if not sample_video_path.exists():
        print("Sample video not found, skipping model size tests")
        return True
    
    model_sizes = ["100", "300", "1000", "2000"]
    
    for size in model_sizes:
        try:
            print(f"Testing model size {size}...")
            result = run_inference(str(sample_video_path), size)
            if result.get('error'):
                print(f"  ✗ {size}-class model failed: {result['error']}")
            else:
                print(f"  ✓ {size}-class model: {result['text']} (confidence: {result['confidence']:.3f})")
        except Exception as e:
            print(f"  ✗ {size}-class model failed: {e}")

def main():
    """Run all tests."""
    print("=" * 50)
    print("Sign Language Recognition Model Test")
    print("=" * 50)
    
    # Test model setup
    if not test_model_setup():
        print("\n❌ Model setup test failed. Exiting.")
        return
    
    # Test video inference
    if not test_video_inference():
        print("\n❌ Video inference test failed.")
    else:
        print("\n✅ All tests passed!")
    
    # Test different model sizes
    test_different_model_sizes()
    
    print("\n" + "=" * 50)
    print("Test completed!")

if __name__ == "__main__":
    main() 