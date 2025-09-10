import React, { createContext, useContext, useState } from 'react';
import type { DetectionResult } from '../utils/api';

interface DetectionContextType {
  detectionResult: DetectionResult | null;
  setDetectionResult: (result: DetectionResult | null) => void;
}

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export const DetectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [detectionResult, setDetectionResultState] = useState<DetectionResult | null>(null);

  const setDetectionResult = (result: DetectionResult | null) => {
    setDetectionResultState(result);
  };

  return (
    <DetectionContext.Provider value={{ detectionResult, setDetectionResult }}>
      {children}
    </DetectionContext.Provider>
  );
};

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (!context) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
}; 