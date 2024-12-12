import { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ text, children, position = 'bottom' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: '-top-10 left-1/2 -translate-x-1/2',
    bottom: '-bottom-10 left-1/2 -translate-x-1/2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute ${positionClasses[position]} z-50`}>
          <div className="bg-gray-900 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
            {text}
          </div>
        </div>
      )}
    </div>
  );
}