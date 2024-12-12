import { useState, useEffect } from 'react';
import { getDeviceInfo, handleMobileError, isMobileCompatible, enableMobileOptimizations } from '../utils/mobile';

export function useMobileDetection() {
  const [deviceInfo, setDeviceInfo] = useState(getDeviceInfo());
  const [isCompatible, setIsCompatible] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Check compatibility
      isMobileCompatible();
      
      // Enable optimizations
      if (deviceInfo.isMobile) {
        enableMobileOptimizations();
      }

      // Listen for orientation changes
      const handleOrientationChange = () => {
        setDeviceInfo(getDeviceInfo());
      };

      window.addEventListener('orientationchange', handleOrientationChange);
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
      };
    } catch (err) {
      handleMobileError(err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsCompatible(false);
    }
  }, [deviceInfo.isMobile]);

  return {
    ...deviceInfo,
    isCompatible,
    error
  };
}