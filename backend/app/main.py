from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.responses import JSONResponse
from app.model import run_inference
import shutil
import os
import tempfile
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Sign Language Recognition API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supported video formats
SUPPORTED_FORMATS = {'.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv', '.wmv'}

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Sign Language Recognition API is running"}

@app.get("/model-info")
def get_model_info():
    """Get information about the model setup."""
    try:
        # Check if model environment is available
        model_dir = Path(__file__).parent.parent.parent / "model"
        model_venv_python = model_dir / ".venv" / "Scripts" / "python.exe"
        inference_script = model_dir / "inference_module.py"

        # Readiness: OK if inference script exists and either venv exists or we can import directly
        status = "not_ready"
        if inference_script.exists():
            status = "ready" if model_venv_python.exists() else "degraded"
        
        return {
            "model_venv_available": model_venv_python.exists(),
            "inference_script_available": inference_script.exists(),
            "model_directory": str(model_dir),
            "status": status
        }
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        return {"error": str(e)}

@app.post("/detect")
async def detect_sign_language(
    file: UploadFile = File(...),
    model_size: str = Query("2000", description="Model size: 100, 300, 1000, or 2000")
):
    """
    Detect sign language in uploaded video.
    
    Args:
        file: Video file to process
        model_size: Size of the model to use (100, 300, 1000, or 2000)
    
    Returns:
        JSON response with detection results
    """
    try:
        # Validate file format
        file_extension = Path(file.filename).suffix.lower()
        if file_extension not in SUPPORTED_FORMATS:
            raise HTTPException(
                status_code=400, 
                detail=f"Unsupported file format. Supported formats: {', '.join(SUPPORTED_FORMATS)}"
            )
        
        # Validate model size
        valid_sizes = ["100", "300", "1000", "2000"]
        if model_size not in valid_sizes:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid model size. Valid sizes: {', '.join(valid_sizes)}"
            )
        
        # Create temporary file with proper extension
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
            # Copy uploaded file to temporary location
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
        
        logger.info(f"Processing video: {file.filename} with model size {model_size}")
        
        try:
            # Run inference
            result = run_inference(temp_path, model_size)
            
            # Add file info to result
            result["file_info"] = {
                "filename": file.filename,
                "file_size": os.path.getsize(temp_path),
                "content_type": file.content_type
            }
            
            logger.info(f"Detection completed for {file.filename}")
            return JSONResponse(content=result)
            
        finally:
            # Clean up temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                logger.info(f"Cleaned up temporary file: {temp_path}")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing video: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/detect-batch")
async def detect_sign_language_batch(
    files: list[UploadFile] = File(...),
    model_size: str = Query("2000", description="Model size: 100, 300, 1000, or 2000")
):
    """
    Detect sign language in multiple uploaded videos.
    
    Args:
        files: List of video files to process
        model_size: Size of the model to use
    
    Returns:
        JSON response with detection results for all videos
    """
    try:
        # Validate model size
        valid_sizes = ["100", "300", "1000", "2000"]
        if model_size not in valid_sizes:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid model size. Valid sizes: {', '.join(valid_sizes)}"
            )
        
        results = []
        temp_files = []
        
        for file in files:
            try:
                # Validate file format
                file_extension = Path(file.filename).suffix.lower()
                if file_extension not in SUPPORTED_FORMATS:
                    results.append({
                        "filename": file.filename,
                        "error": f"Unsupported file format: {file_extension}"
                    })
                    continue
                
                # Create temporary file
                with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as temp_file:
                    shutil.copyfileobj(file.file, temp_file)
                    temp_path = temp_file.name
                    temp_files.append(temp_path)
                
                # Run inference
                result = run_inference(temp_path, model_size)
                result["filename"] = file.filename
                results.append(result)
                
            except Exception as e:
                logger.error(f"Error processing {file.filename}: {e}")
                results.append({
                    "filename": file.filename,
                    "error": str(e)
                })
        
        # Clean up temporary files
        for temp_path in temp_files:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
        return JSONResponse(content={
            "results": results,
            "total_files": len(files),
            "successful_detections": len([r for r in results if "error" not in r])
        })
    
    except Exception as e:
        logger.error(f"Error in batch processing: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)