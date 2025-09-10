import subprocess
import sys
import os
import json
import tempfile
from pathlib import Path
from typing import Dict
import logging
import importlib.util

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def run_inference(video_path: str, model_size: str = "2000") -> Dict:
    """
    Run sign language inference using the model venv.
    
    Args:
        video_path: Path to the video file
        model_size: Size of the model to use
        
    Returns:
        Dictionary containing prediction results
    """
    try:
        # Get the model directory path
        model_dir = Path(__file__).parent.parent.parent / "model"
        model_venv_python = model_dir / ".venv" / "Scripts" / "python.exe"
        inference_script = model_dir / "inference_module.py"
        
        # Ensure inference script exists
        if not inference_script.exists():
            logger.error(f"Inference script not found at {inference_script}")
            return {
                "text": "Inference script not available",
                "confidence": 0.0,
                "alternatives": [],
                "error": "Inference script not found"
            }

        # Helper: try direct import fallback
        def _run_via_direct_import() -> Dict:
            try:
                sys.path.insert(0, str(model_dir))
                spec = importlib.util.spec_from_file_location("inference_module", str(inference_script))
                if spec and spec.loader:
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)  # type: ignore[attr-defined]
                    logger.info("Running inference via direct import fallback")
                    return module.run_inference(video_path, model_size)  # type: ignore[attr-defined]
                else:
                    raise ImportError("Unable to load inference_module spec")
            except Exception as e:
                logger.error(f"Direct import fallback failed: {e}")
                return {
                    "text": "Inference failed",
                    "confidence": 0.0,
                    "alternatives": [],
                    "error": f"Direct import failed: {e}"
                }
        
        # Prefer venv if available; otherwise fall back to direct import
        if model_venv_python.exists():
            # Run inference using subprocess in model venv
            cmd = [
                str(model_venv_python),
                str(inference_script),
                video_path,
                "--model_size", model_size
            ]
            logger.info(f"Running inference command: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=str(model_dir)
            )
            if result.returncode != 0:
                logger.error(f"Inference via venv failed (rc={result.returncode}). Falling back. stderr: {result.stderr}")
                return _run_via_direct_import()
        else:
            logger.warning(f"Model venv not found at {model_venv_python}. Using direct import fallback.")
            return _run_via_direct_import()
        
        # Parse the output from venv subprocess to extract prediction
        output_lines = result.stdout.strip().split('\n')
        
        # Extract prediction from output
        prediction = "Unknown"
        confidence = 0.0
        model_info = {}
        
        for line in output_lines:
            if line.startswith("Prediction:"):
                prediction = line.split(":", 1)[1].strip()
            elif line.startswith("Confidence:"):
                confidence = float(line.split(":", 1)[1].strip())
            elif line.startswith("Model Info:"):
                try:
                    model_info_str = line.split(":", 1)[1].strip()
                    model_info = eval(model_info_str)  # Safe for our controlled output
                except:
                    pass
        
        # Create result dictionary
        result_dict = {
            "text": prediction,
            "confidence": confidence,
            "alternatives": [],  # We could parse alternatives if needed
            "model_info": model_info
        }
        
        logger.info(f"Inference completed: {prediction} (confidence: {confidence:.3f})")
        return result_dict
        
    except Exception as e:
        logger.error(f"Error running inference: {e}")
        return {
            "text": "Unable to process video",
            "confidence": 0.0,
            "alternatives": [],
            "error": str(e)
        } 