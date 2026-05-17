import React from 'react';
import Lottie from 'lottie-react';
// Replace with an actual honey drop animation json if available
// import honeyDropData from '../../../public/lottie/honey-drop.json';

const Loader = ({ fullScreen = true, message = 'Loading sweet things...' }) => {
  // Mock animation data (empty for now, should be replaced with real lottie)
  const mockAnimationData = null;

  const content = (
    <div className="flex flex-col items-center justify-center">
      {mockAnimationData ? (
        <div className="w-32 h-32">
          <Lottie animationData={mockAnimationData} loop={true} />
        </div>
      ) : (
        <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mb-4"></div>
      )}
      <p className="text-secondary dark:text-amber-100 font-medium animate-pulse">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="p-8 flex justify-center w-full">{content}</div>;
};

export default Loader;
