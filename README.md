
# Gesture Flow

Sign language detection app with a React (Vite) frontend, FastAPI backend, and a PyTorch I3D model. Supports webcam recording or video uploads, and saves detection history to Appwrite for analytics.

## Repo Structure
- `frontend/`: React + TypeScript + Tailwind UI
- `backend/`: FastAPI API server
- `model/`: Standalone I3D inference module and assets

## Prerequisites
- Node 18+
- Python 3.10+
- FFmpeg installed and on PATH (for robust video handling)
- Appwrite project (for history/analytics) or disable history storage

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv venv
venv/Scripts/activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
# Dev
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend exposes:
- GET `/health` – server status
- GET `/model-info`
- POST `/detect` – single video
- POST `/detect-batch` – multiple videos

### 2) Model (optional separate venv)
The backend will import and run `model/inference_module.py`. For best isolation you can also create a dedicated venv inside `model/`:
```bash
cd model
python -m venv .venv
.venv/Scripts/activate  # Windows
# source .venv/bin/activate  # macOS/Linux
# Install deps: torch, torchvision, torchaudio (per CUDA), plus opencv-python, numpy
pip install torch opencv-python numpy
```
Place weights under `model/code/I3D/archived/asl{size}/` (e.g. `asl2000/`). The app resolves the best `.pt` file automatically, preferring names with `FINAL`.

Notes:
- Videos are preprocessed to 224x224, 64 frames, normalized to [-1,1].
- If no weights are found, the model will run with random weights (low accuracy) and log a warning.

### 3) Frontend
```bash
cd frontend
npm install
# Create .env with Appwrite (or skip if not using history)
# VITE_APPWRITE_ENDPOINT=...
# VITE_APPWRITE_PROJECT_ID=...
# VITE_APPWRITE_DATABASE_ID=...
# VITE_APPWRITE_DETECTION_COLLECTION_ID=...
npm run dev
```
If you don't configure Appwrite, detection still works; dashboard analytics that rely on history will be empty.

## Using the App
- Detection page: record via camera or upload a video, then Translate.
- Dashboard: shows real analytics derived from Appwrite detection history.
- History: lists your past detections.


## Ignore large files
- `model/.gitignore` already excludes `start_kit/videos/` and `*.pt` weights.
- Consider adding a root or backend `.gitignore` entry to exclude `backend/sample_video/` if pushing publicly.

## Troubleshooting
- Backend offline: ensure FastAPI is running on `http://127.0.0.1:8000`
- No weights found: check `model/code/I3D/archived/asl{size}/` exists and contains `.pt`
- Video errors: install FFmpeg and ensure browser permissions allow camera access

## Scripts
- Backend dev: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
- Frontend dev: `npm run dev`

## Tech Notes (I3D)
I3D is an Inception-based model inflated to 3D to jointly capture appearance and motion. We sample ~64 frames, run through I3D, average logits over time, and report top‑k classes with confidence.

