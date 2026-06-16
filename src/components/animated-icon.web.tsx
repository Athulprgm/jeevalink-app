import React, { useEffect, useState } from 'react';

interface AnimatedIconProps {
  size?: number;
  loop?: boolean;
}

export default function AnimatedIcon({ size = 380, loop = true }: AnimatedIconProps) {
  const [key, setKey] = useState(0);

  // Load Font Awesome dynamically
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  useEffect(() => {
    if (!loop) return;
    
    // Restart animation flow every 6 seconds to keep it dynamic
    const interval = setInterval(() => {
      setKey((prev) => prev + 1);
    }, 6000);

    return () => clearInterval(interval);
  }, [loop]);

  return (
    <div
      key={key}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size + 120}px`,
        backgroundColor: '#ffffff',
        fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {/* Premium Styles & Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;800;900&display=swap');

        /* ─── Pulsing Glow Behind ─── */
        @keyframes glow-pulse {
          0% { transform: scale(0.85); opacity: 0.15; filter: blur(30px); }
          50% { transform: scale(1.2); opacity: 0.4; filter: blur(45px); }
          100% { transform: scale(0.85); opacity: 0.15; filter: blur(30px); }
        }

        /* ─── Outer Rotating Ring ─── */
        @keyframes rotate-ring {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ─── Double Heartbeat Scaling ─── */
        @keyframes double-heartbeat {
          0% { transform: scale(1); }
          12% { transform: scale(1.08); }
          24% { transform: scale(0.96); }
          36% { transform: scale(1.05); }
          50% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        /* ─── Inner ECG Wave Dash Drawing ─── */
        @keyframes ecg-draw {
          0% { opacity: 0; transform: scale(0.5); }
          30% { opacity: 1; transform: scale(1); }
          70% { transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* ─── Text Slide-Up & Fade ─── */
        @keyframes text-slide-up {
          0% { transform: translateY(24px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* ─── Class Mappings ─── */
        .ambient-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, #8B0000 0%, rgba(139,0,0,0) 70%);
          z-index: 1;
          transform-origin: center;
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .outer-ring {
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          border: 2.5px dashed #8B0000;
          opacity: 0.75;
          z-index: 2;
          transform-origin: center;
          animation: rotate-ring 22s linear infinite;
        }

        .main-droplet-card {
          position: relative;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background-color: #ffffff;
          border: 3.5px solid #8B0000;
          display: flex;
          alignItems: center;
          justifyContent: center;
          box-shadow: 0 12px 28px rgba(139, 0, 0, 0.18), 0 4px 10px rgba(0, 0, 0, 0.04);
          z-index: 3;
          transform-origin: center;
          animation: double-heartbeat 1.8s ease-in-out infinite;
        }

        .fa-droplet-main {
          color: #8B0000;
          font-size: 84px;
          position: absolute;
          transform-origin: bottom center;
        }

        .fa-pulse-overlay {
          color: #ffffff;
          font-size: 32px;
          position: absolute;
          z-index: 4;
          margin-top: 18px; /* Position inside the bulbous lower part of droplet */
          animation: ecg-draw 2.5s ease-in-out infinite alternate;
        }

        .jeeva-brand {
          animation: text-slide-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          opacity: 0;
        }

        .tagline-brand {
          animation: text-slide-up 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards;
          opacity: 0;
        }
      ` }} />

      {/* Ambient Glow */}
      <div className="ambient-glow" style={{ top: '80px' }} />

      {/* Interactive Visual Stage */}
      <div
        style={{
          position: 'relative',
          width: '260px',
          height: '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        {/* Dashed Orbiting Ring */}
        <div className="outer-ring" />

        {/* Center Pulsing Droplet Card */}
        <div className="main-droplet-card">
          {/* Main Blood Droplet Icon (Font Awesome) */}
          <i className="fa-solid fa-droplet fa-droplet-main" />
          
          {/* ECG Line Overlayed (Font Awesome) */}
          <i className="fa-solid fa-heart-pulse fa-pulse-overlay" />
        </div>
      </div>

      {/* Text/Branding Stage */}
      <div style={{ textAlign: 'center', marginTop: '24px', zIndex: 10 }}>
        <h1
          className="jeeva-brand"
          style={{
            margin: 0,
            fontSize: '46px',
            fontWeight: 900,
            color: '#8B0000', /* Premium Dark Red */
            letterSpacing: '5px',
            textShadow: '0 2px 4px rgba(139, 0, 0, 0.08)',
          }}
        >
          JEEVA
        </h1>
        <p
          className="tagline-brand"
          style={{
            margin: '8px 0 0 0',
            fontSize: '15px',
            fontWeight: 500,
            color: '#7f8c8d', /* Clean grey matching theme */
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          Donate Blood <span style={{ color: '#8B0000' }}>•</span> Save Lives
        </p>
      </div>
    </div>
  );
}
