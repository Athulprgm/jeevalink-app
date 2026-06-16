import React, { useEffect, useRef } from 'react';

// Require the lightweight, transparent WebM video
const videoAsset = require('../../assets/InShot_20260608_170726564-Picsart-BackgroundRemover (1).webm');
const videoSrc: string =
  typeof videoAsset === 'string'
    ? videoAsset
    : (videoAsset as any)?.default ?? (videoAsset as any)?.uri ?? '';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const fallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Safety net — exit loading state after 5 seconds regardless
    fallbackRef.current = setTimeout(onFinish, 5000);
    return () => {
      if (fallbackRef.current) clearTimeout(fallbackRef.current);
    };
  }, [onFinish]);

  const handleDone = () => {
    if (fallbackRef.current) clearTimeout(fallbackRef.current);
    onFinish();
  };

  return React.createElement(
    'div',
    {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#FFFFFF', // Keep background clean white matching original style
        overflow: 'hidden',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
    React.createElement('video', {
      key: 'splash-video-webm',
      src: videoSrc,
      autoPlay: true,
      playsInline: true,
      muted: true,
      style: {
        width: '280px',
        height: '280px',
        objectFit: 'contain',
        display: 'block',
      },
      onEnded: handleDone,
      onError: handleDone,
    })
  );
}
