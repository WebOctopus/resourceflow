import { AppError } from './error';

export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isTablet: boolean;
  browserName: string;
  browserVersion: string;
  deviceType: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  const ua = navigator.userAgent;
  const mobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua);
  
  return {
    isMobile: mobile,
    isIOS: /iPhone|iPad|iPod/.test(ua),
    isAndroid: /Android/.test(ua),
    isTablet: /iPad|Android(?!.*Mobile)/.test(ua),
    browserName: getBrowserName(ua),
    browserVersion: getBrowserVersion(ua),
    deviceType: getDeviceType(ua)
  };
};

const getBrowserName = (ua: string): string => {
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  return 'Unknown';
};

const getBrowserVersion = (ua: string): string => {
  const match = ua.match(/(Firefox|Chrome|Safari|Edge)\/(\d+\.\d+)/);
  return match ? match[2] : 'Unknown';
};

const getDeviceType = (ua: string): string => {
  if (/iPad|Android(?!.*Mobile)/.test(ua)) return 'tablet';
  if (/Mobile|Android|iPhone|iPod/.test(ua)) return 'mobile';
  return 'desktop';
};

export const handleMobileError = (error: unknown): void => {
  const deviceInfo = getDeviceInfo();
  console.error('Mobile Error:', {
    error: error instanceof Error ? error.message : 'Unknown error',
    deviceInfo,
    timestamp: new Date().toISOString(),
    url: window.location.href
  });
};

export const isMobileCompatible = (): boolean => {
  const { isMobile, browserName, browserVersion } = getDeviceInfo();
  if (!isMobile) return true;

  // Check for known compatibility issues
  if (browserName === 'Safari' && parseFloat(browserVersion) < 14) {
    throw new AppError(
      'Please update your Safari browser for the best experience',
      'COMPATIBILITY_ERROR',
      400
    );
  }

  return true;
};

export const enableMobileOptimizations = (): void => {
  // Prevent elastic scrolling on iOS
  document.body.style.overscrollBehavior = 'none';
  
  // Disable double-tap zoom
  const meta = document.createElement('meta');
  meta.name = 'viewport';
  meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  document.head.appendChild(meta);
  
  // Add touch event handlers
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });
};

const handleTouchStart = (e: TouchEvent): void => {
  // Touch event handling logic
};

const handleTouchMove = (e: TouchEvent): void => {
  // Prevent unwanted scrolling behaviors
  if (shouldPreventScroll(e)) {
    e.preventDefault();
  }
};

const shouldPreventScroll = (e: TouchEvent): boolean => {
  const target = e.target as HTMLElement;
  return target.classList.contains('no-scroll') || 
         (target.tagName === 'INPUT' && target.getAttribute('type') === 'range');
};