import React from 'react';
import Lottie from 'lottie-react';

interface LottieIconProps {
  animationData?: any;
  url?: string;
  size?: number;
  className?: string;
}

export const LottieIcon: React.FC<LottieIconProps> = ({ animationData, url, size = 24, className }) => {
  // If we had local assets, we would load them from /assets/lottie/
  // For now, we'll use a fallback or a public URL if provided
  
  if (!animationData && !url) {
    return <div style={{ width: size, height: size }} className={className} />;
  }

  return (
    <div style={{ width: size, height: size }} className={className}>
      <Lottie 
        animationData={animationData} 
        loop={true}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
