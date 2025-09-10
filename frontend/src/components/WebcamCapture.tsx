import React, { useCallback, useEffect, useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { VideoIcon, StopCircleIcon, PlayIcon, CameraOffIcon, SettingsIcon, XIcon, MaximizeIcon, MinimizeIcon, FlipHorizontal2Icon } from 'lucide-react';
import Button from './Button';
interface WebcamCaptureProps {
  onCapture: (videoBlob: Blob) => void;
}
const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture
}) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(undefined);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 1280, height: 720 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Check for webcam permissions on component mount
  useEffect(() => {
    async function checkPermissions() {
      try {
        // Request camera access in a way that won't interfere with extensions
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        // Immediately stop all tracks to release the camera
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasPermission(false);
      }
    }
    checkPermissions();
    // Enumerate available camera devices
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const cams = devices.filter(d => d.kind === 'videoinput');
        setAvailableDevices(cams);
        if (cams.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(cams[0].deviceId);
        }
      }).catch(() => {
        // ignore
      });
    }
    // Clean up any resources on unmount
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current && capturing) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  const handleStartCaptureClick = useCallback(() => {
    setRecordedChunks([]);
    setCountdown(3);
    countdownTimerRef.current = setInterval(() => {
      setCountdown(prevCount => {
        if (prevCount <= 1) {
          clearInterval(countdownTimerRef.current!);
          startRecording();
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  }, [webcamRef, setRecordedChunks]);
  const startRecording = useCallback(() => {
    setCapturing(true);
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prevTime => {
        // Stop at 4 seconds
        if (prevTime >= 4) {
          handleStopCaptureClick();
          return 4;
        }
        return prevTime + 1;
      });
    }, 1000);
    if (webcamRef.current && webcamRef.current.stream) {
      try {
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
          mimeType: 'video/webm'
        });
        mediaRecorderRef.current.addEventListener('dataavailable', handleDataAvailable);
        mediaRecorderRef.current.start();
      } catch (err) {
        console.error('Error starting media recorder:', err);
        setCapturing(false);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
        }
      }
    }
  }, [webcamRef, mediaRecorderRef, setCapturing]);
  const handleDataAvailable = useCallback(({
    data
  }: BlobEvent) => {
    if (data.size > 0) {
      setRecordedChunks(prev => [...prev, data]);
    }
  }, [setRecordedChunks]);
  const handleStopCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setCapturing(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      setRecordingTime(0);
    }
  }, [mediaRecorderRef, setCapturing]);
  
  const handleProcessVideo = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: 'video/webm'
      });
      onCapture(blob);
      setRecordedChunks([]);
    }
  }, [recordedChunks, onCapture]);

  // Build preview URL when there is a recording
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [recordedChunks]);

  const handleRetake = useCallback(() => {
    setRecordedChunks([]);
  }, []);

  const handleTranslate = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onCapture(blob);
      setRecordedChunks([]);
    }
  }, [recordedChunks, onCapture]);

  const videoConstraints = {
    width: resolution.width,
    height: resolution.height,
    deviceId: selectedDeviceId,
    facingMode: 'user'
  } as MediaTrackConstraints;

  const toggleCamera = () => {
    if (isCameraOn) {
      if (webcamRef.current && webcamRef.current.stream) {
        const tracks = webcamRef.current.stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    }
    setIsCameraOn(!isCameraOn);
  };
  // Show permissions message if access is denied
  if (hasPermission === false) {
    return <div className="flex flex-col items-center justify-center p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 mb-4">
          Camera access denied. Please enable camera permissions for this site.
        </p>
        <Button onClick={() => setHasPermission(null)} variant="secondary">
          Try Again
        </Button>
      </div>;
  }
  const containerClass = isFullscreen ? 'fixed inset-0 z-50 bg-black flex items-center justify-center' : 'relative w-full max-w-3xl';
  return <div className="flex flex-col items-center">
      <div className={containerClass}>
        {isCameraOn ? <div className="rounded-lg overflow-hidden border-4 border-indigo-600 relative" style={{ aspectRatio: '16 / 9' }}>
            <Webcam audio={false} ref={webcamRef} videoConstraints={videoConstraints} className="w-full h-auto" style={isMirrored ? { transform: 'scaleX(-1)' } : undefined} onUserMediaError={err => {
          console.error('Webcam error:', err);
          setHasPermission(false);
        }} />
            {/* Camera controls overlay */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-gray-800 bg-opacity-75 rounded-full text-white hover:bg-opacity-90 transition-colors">
                <SettingsIcon size={20} />
              </button>
              <button onClick={() => setIsMirrored(m => !m)} className="p-2 bg-gray-800 bg-opacity-75 rounded-full text-white hover:bg-opacity-90 transition-colors">
                <FlipHorizontal2Icon size={20} />
              </button>
              <button onClick={() => setIsFullscreen(f => !f)} className="p-2 bg-gray-800 bg-opacity-75 rounded-full text-white hover:bg-opacity-90 transition-colors">
                {isFullscreen ? <MinimizeIcon size={20} /> : <MaximizeIcon size={20} />}
              </button>
              <button onClick={toggleCamera} className="p-2 bg-gray-800 bg-opacity-75 rounded-full text-white hover:bg-opacity-90 transition-colors">
                <CameraOffIcon size={20} />
              </button>
            </div>
          </div> : <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <CameraOffIcon className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">Camera is turned off</p>
              <Button onClick={toggleCamera} variant="secondary">
                Turn On Camera
              </Button>
            </div>
          </div>}
        {countdown > 0 && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-6xl font-bold">{countdown}</div>
          </div>}
        {capturing && <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-md flex items-center">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse mr-2"></div>
            <span>Recording {recordingTime}s / 4s</span>
          </div>}
        {/* Settings panel */}
        {showSettings && <div className="absolute top-16 right-4 w-72 bg-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Camera Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:text-gray-700">
                <XIcon size={20} />
              </button>
            </div>
            {/* Add camera settings controls here */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Camera Device
                </label>
                <select className="w-full border rounded-md p-2" value={selectedDeviceId} onChange={e => setSelectedDeviceId(e.target.value)}>
                  {availableDevices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 6)}`}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution
                </label>
                <select className="w-full border rounded-md p-2" value={`${resolution.width}x${resolution.height}`} onChange={e => {
                  const [w, h] = e.target.value.split('x').map(Number);
                  setResolution({ width: w, height: h });
                }}>
                  <option value="1920x1080">1920x1080</option>
                  <option value="1280x720">1280x720</option>
                  <option value="640x480">640x480</option>
                  <option value="320x240">320x240</option>
                </select>
              </div>
            </div>
          </div>}
      </div>
      <div className="mt-6 flex space-x-4">
        {capturing ? <Button onClick={handleStopCaptureClick} variant="secondary" className="flex items-center" disabled={!isCameraOn}>
            <StopCircleIcon className="w-5 h-5 mr-2" />
            Stop Recording
          </Button> : <Button onClick={handleStartCaptureClick} className="flex items-center" disabled={countdown > 0 || !isCameraOn}>
            {countdown > 0 ? 'Preparing...' : <>
                <VideoIcon className="w-5 h-5 mr-2" />
                Start Recording
              </>}
          </Button>}
        {recordedChunks.length > 0 && !capturing && <>
            <Button onClick={handleTranslate} variant="outline" className="flex items-center">
              <PlayIcon className="w-5 h-5 mr-2" />
              Translate
            </Button>
            <Button onClick={handleRetake} variant="secondary" className="flex items-center">
              <XIcon className="w-5 h-5 mr-2" />
              Retake
            </Button>
          </>}
      </div>
      {previewUrl && !capturing && <div className="w-full max-w-3xl mt-4">
          <div className="rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: '16 / 9' }}>
            <video src={previewUrl} controls className="w-full h-auto" />
          </div>
        </div>}
      {capturing && <div className="w-full max-w-3xl mt-4">
          <div className="w-full h-2 bg-gray-200 rounded">
            <div className="h-2 bg-indigo-600 rounded" style={{ width: `${(recordingTime / 4) * 100}%` }}></div>
          </div>
        </div>}
    </div>;
};
export default WebcamCapture;