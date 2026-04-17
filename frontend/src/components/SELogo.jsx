import React from 'react'

const SELogo = ({ size = 40 }) => {
  const r = size / 2
  const strokeW = size * 0.055
  const innerR = r - strokeW - size * 0.04

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Gold ring gradient */}
        <linearGradient id={`ring-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#8b6914" />
          <stop offset="25%"  stopColor="#f5e27a" />
          <stop offset="50%"  stopColor="#c9a84c" />
          <stop offset="75%"  stopColor="#f5e27a" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        {/* SE text gradient */}
        <linearGradient id={`text-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#f7eca0" />
          <stop offset="40%"  stopColor="#c9a84c" />
          <stop offset="70%"  stopColor="#f5e27a" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        {/* Subtle inner glow */}
        <radialGradient id={`bg-${size}`} cx="50%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#3a3d5c" />
          <stop offset="100%" stopColor="#1e2035" />
        </radialGradient>
        {/* Glow filter */}
        <filter id={`glow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={size * 0.04} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer gold ring */}
      <circle
        cx={r} cy={r} r={r - strokeW / 2}
        stroke={`url(#ring-${size})`}
        strokeWidth={strokeW}
        fill="none"
      />

      {/* Dark inner background */}
      <circle
        cx={r} cy={r} r={innerR}
        fill={`url(#bg-${size})`}
      />

      {/* SE text */}
      <text
        x="50%"
        y="56%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={`url(#text-${size})`}
        filter={`url(#glow-${size})`}
        fontSize={size * 0.38}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontStyle="italic"
        fontWeight="bold"
        letterSpacing={size * -0.01}
      >
        SE
      </text>
    </svg>
  )
}

export default SELogo
