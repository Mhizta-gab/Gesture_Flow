# Sign Language Recognition Backend

This backend provides a FastAPI-based REST API for sign language recognition using the I3D (Inception 3D) model trained on the WLASL dataset.

## Features

- **Real-time sign language detection** from video uploads
- **Multiple model sizes** (100, 300, 1000, 2000 classes)
- **Batch processing** for multiple videos
- **Comprehensive error handling** and validation
- **RESTful API** with automatic documentation
- **CORS support** for frontend integration

## Model Architecture

The system uses the **I3D (Inception 3D)** model:
- **Architecture**: 3D Convolutional Neural Network based on Inception-v1
- **Input**: RGB video frames (224x224 resolution)
- **Output**: Sign language word predictions with confidence scores
- **Pre-trained**: On Kinetics dataset, fine-tuned on WLASL dataset

## Installation

1. **Install Python dependencies**:
```bash
pip install -r requirements.txt
```

2. **Verify model files**:
   - Ensure the model weights are available in `../model/code/I3D/archived/`
   - Check that class list exists at `../model/code/I3D/preprocess/wlasl_class_list.txt`

## Usage

### Starting the Server

```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### API Endpoints

#### 1. Health Check
```bash
GET /health
```
Returns server status and basic information.

#### 2. Model Information
```bash
GET /model-info
```
Returns information about the loaded model (size, device, etc.).

#### 3. Single Video Detection
```bash
POST /detect
```
**Parameters**:
- `file`: Video file (supported formats: mp4, avi, mov, mkv, webm, flv, wmv)
- `model_size`: Model size (100, 300, 1000, 2000) - optional, defaults to 2000

**Response**:
```json
{
  "text": "detected_sign_word",
  "confidence": 0.85,
  "alternatives": [
    {"text": "alternative_word", "confidence": 0.75}
  ],
  "model_info": {
    "model_size": "2000",
    "num_classes": 2000,
    "device": "cpu"
  },
  "file_info": {
    "filename": "video.mp4",
    "file_size": 1024000,
    "content_type": "video/mp4"
  }
}
```

#### 4. Batch Video Detection
```bash
POST /detect-batch
```
**Parameters**:
- `files`: Multiple video files
- `model_size`: Model size (100, 300, 1000, 2000) - optional, defaults to 2000

**Response**:
```json
{
  "results": [
    {
      "filename": "video1.mp4",
      "text": "detected_word",
      "confidence": 0.85,
      "alternatives": [...]
    }
  ],
  "total_files": 2,
  "successful_detections": 2
}
```

## Testing

Run the test script to verify the model inference:

```bash
python test_inference.py
```

This will:
1. Test model loading
2. Test video inference with sample video
3. Test different model sizes

## Model Sizes

The system supports different model sizes based on the WLASL dataset:

- **WLASL100**: Top 100 most common ASL words
- **WLASL300**: Top 300 most common ASL words  
- **WLASL1000**: Top 1000 most common ASL words
- **WLASL2000**: Full dataset with 2000 ASL words

## Performance

- **Inference Time**: ~2-5 seconds per video (depending on video length and hardware)
- **Memory Usage**: ~2-4GB RAM (depending on model size)
- **GPU Support**: Automatic CUDA detection if available
- **Video Processing**: Supports videos up to 64 frames (automatically sampled)

## Error Handling

The API provides comprehensive error handling:

- **File Format Validation**: Rejects unsupported video formats
- **Model Size Validation**: Validates requested model size
- **Video Processing Errors**: Handles corrupted or invalid videos
- **Model Loading Errors**: Graceful fallback if model fails to load

## Development

### Project Structure
```
backend/
├── app/
│   ├── main.py          # FastAPI application
│   ├── model.py         # I3D model inference
│   └── utils.py         # Utility functions
├── requirements.txt     # Python dependencies
├── test_inference.py    # Test script
└── README.md           # This file
```

### Adding New Features

1. **New Model Architecture**: Add new model class in `model.py`
2. **Additional Endpoints**: Add routes in `main.py`
3. **Custom Preprocessing**: Modify `preprocess_video()` method in `SignLanguageModel`

## Troubleshooting

### Common Issues

1. **Model Loading Fails**:
   - Check if model weights exist in the correct path
   - Verify PyTorch installation and version compatibility

2. **Video Processing Errors**:
   - Ensure OpenCV is properly installed
   - Check video file format and corruption

3. **Memory Issues**:
   - Reduce batch size or video frame count
   - Use smaller model size (100 or 300 classes)

4. **CUDA Errors**:
   - Verify CUDA installation and PyTorch CUDA support
   - Model will automatically fall back to CPU if CUDA unavailable

### Logs

The application provides detailed logging:
- Model loading and initialization
- Video processing steps
- Inference results
- Error details

Check the console output for debugging information.

## License

This project uses the WLASL dataset and models under the Computational Use of Data Agreement (C-UDA). See the model directory for license details. 