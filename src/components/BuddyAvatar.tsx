import React from 'react';

interface BuddyAvatarProps {
  expression?: 'happy' | 'talking' | 'listening' | 'thinking' | 'cheering';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  speechText?: string;
  onClick?: () => void;
  className?: string;
}

export const BuddyAvatar: React.FC<BuddyAvatarProps> = ({
  expression = 'happy',
  size = 'md',
  showSpeechBubble = false,
  speechText = '',
  onClick,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
    xl: 'w-60 h-60',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Optional Speech Bubble */}
      {showSpeechBubble && speechText && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-white text-slate-800 text-xs sm:text-sm font-bold px-3 py-1.5 rounded-2xl shadow-lg border-2 border-cyan-400 animate-bounce">
          {speechText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}

      {/* Buddy Robot SVG */}
      <div className={`relative ${sizeMap[size]} animate-float transition-transform duration-300 hover:scale-105`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Robot body gradients */}
            <linearGradient id="buddyBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>

            <linearGradient id="buddyWhite" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>

            <linearGradient id="buddyScreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            <linearGradient id="eyeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Antenna */}
          <g className="animate-pulse">
            <line x1="100" y1="36" x2="100" y2="18" stroke="#0284c7" strokeWidth="6" strokeLinecap="round" />
            <circle cx="100" cy="14" r="9" fill="#facc15" filter="url(#glow)" />
            <circle cx="98" cy="12" r="3" fill="#ffffff" />
          </g>

          {/* Ears / Side audio sensors */}
          <rect x="22" y="70" width="14" height="28" rx="7" fill="#0284c7" />
          <circle cx="29" cy="84" r="4" fill="#38bdf8" />
          <rect x="164" y="70" width="14" height="28" rx="7" fill="#0284c7" />
          <circle cx="171" cy="84" r="4" fill="#38bdf8" />

          {/* Left Waving Arm */}
          <g className={expression === 'happy' || expression === 'cheering' ? 'animate-wave' : ''}>
            <rect x="18" y="125" width="20" height="38" rx="10" fill="url(#buddyWhite)" stroke="#cbd5e1" strokeWidth="2" />
            <circle cx="28" cy="165" r="9" fill="#0284c7" />
          </g>

          {/* Right Arm */}
          <rect x="162" y="125" width="20" height="38" rx="10" fill="url(#buddyWhite)" stroke="#cbd5e1" strokeWidth="2" />
          <circle cx="172" cy="165" r="9" fill="#0284c7" />

          {/* Feet */}
          <ellipse cx="75" cy="188" rx="18" ry="9" fill="#0284c7" />
          <ellipse cx="125" cy="188" rx="18" ry="9" fill="#0284c7" />

          {/* Main Body */}
          <rect x="52" y="118" width="96" height="66" rx="28" fill="url(#buddyWhite)" stroke="#e2e8f0" strokeWidth="2" />
          {/* Blue chest harness/panel */}
          <rect x="68" y="128" width="64" height="46" rx="16" fill="url(#buddyBlue)" />
          {/* Heart / AI Core */}
          <circle cx="100" cy="151" r="14" fill="#ffffff" />
          <path
            d="M100 144 C100 144 94 138 90 144 C86 150 100 159 100 159 C100 159 114 150 110 144 C106 138 100 144 100 144 Z"
            fill="#f43f5e"
            className="animate-pulse"
          />

          {/* Head */}
          <rect x="36" y="36" width="128" height="92" rx="36" fill="url(#buddyWhite)" stroke="#cbd5e1" strokeWidth="2" />
          {/* Blue Head Crown/Band */}
          <path d="M46 54 C60 40 140 40 154 54 L150 68 C135 56 65 56 50 68 Z" fill="url(#buddyBlue)" />

          {/* Visor / Face Screen */}
          <rect x="48" y="52" width="104" height="64" rx="24" fill="url(#buddyScreen)" stroke="#38bdf8" strokeWidth="2" />

          {/* Eyes depending on expression */}
          <g className="animate-blink">
            {expression === 'cheering' || expression === 'happy' ? (
              <>
                {/* Happy curved eyes (crescent arcs) */}
                <path d="M68 84 Q78 70 88 84" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" filter="url(#glow)" />
                <path d="M112 84 Q122 70 132 84" stroke="#22d3ee" strokeWidth="7" strokeLinecap="round" filter="url(#glow)" />
              </>
            ) : expression === 'thinking' ? (
              <>
                {/* Thinking one round, one raised */}
                <circle cx="78" cy="80" r="10" fill="url(#eyeGlow)" filter="url(#glow)" />
                <line x1="112" y1="76" x2="132" y2="76" stroke="#22d3ee" strokeWidth="6" strokeLinecap="round" filter="url(#glow)" />
              </>
            ) : expression === 'listening' ? (
              <>
                {/* Listening wide glowing eyes with sound rings */}
                <circle cx="78" cy="80" r="12" fill="url(#eyeGlow)" filter="url(#glow)" />
                <circle cx="122" cy="80" r="12" fill="url(#eyeGlow)" filter="url(#glow)" />
                <circle cx="78" cy="80" r="5" fill="#ffffff" />
                <circle cx="122" cy="80" r="5" fill="#ffffff" />
              </>
            ) : (
              <>
                {/* Standard bright friendly glowing eyes */}
                <ellipse cx="78" cy="80" rx="10" ry="12" fill="url(#eyeGlow)" filter="url(#glow)" />
                <circle cx="75" cy="76" r="4" fill="#ffffff" />
                <ellipse cx="122" cy="80" rx="10" ry="12" fill="url(#eyeGlow)" filter="url(#glow)" />
                <circle cx="119" cy="76" r="4" fill="#ffffff" />
              </>
            )}
          </g>

          {/* Rosy cheeks */}
          <circle cx="62" cy="98" r="6" fill="#f472b6" opacity="0.6" />
          <circle cx="138" cy="98" r="6" fill="#f472b6" opacity="0.6" />

          {/* Mouth */}
          {expression === 'talking' ? (
            <path d="M90 98 Q100 110 110 98" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" fill="#0284c7" />
          ) : expression === 'cheering' ? (
            <path d="M88 96 Q100 114 112 96 Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          ) : (
            <path d="M92 98 Q100 106 108 98" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          )}

          {/* Sound waves when listening or talking */}
          {(expression === 'listening' || expression === 'talking') && (
            <g className="animate-pulse">
              <path d="M12 76 C10 82 10 86 12 92" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <path d="M6 72 C4 82 4 88 6 96" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
              <path d="M188 76 C190 82 190 86 188 92" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
              <path d="M194 72 C196 82 196 88 194 96" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>

      {/* Soft shadow */}
      <div className="w-20 h-3 bg-slate-300/60 rounded-full blur-[3px] mt-1" />
    </div>
  );
};
