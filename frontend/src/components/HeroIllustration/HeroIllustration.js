import React from 'react';
import './HeroIllustration.css';

const HeroIllustration = () => {
  return (
    <div className="hero-illustration-wrapper">
      <div className="illustration-glow-orb" />
      <svg
        className="hero-svg-img"
        viewBox="0 0 600 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Decorative Rings */}
        <circle cx="300" cy="250" r="180" stroke="url(#purple-grad)" strokeWidth="2" strokeDasharray="6 6" className="spin-slow" />
        <circle cx="300" cy="250" r="210" stroke="rgba(199, 112, 240, 0.15)" strokeWidth="1.5" />

        {/* Floating Tech Badges */}
        <g className="float-item-1">
          <rect x="70" y="80" width="120" height="44" rx="22" fill="rgba(22, 33, 62, 0.85)" stroke="#c770f0" strokeWidth="1.5" />
          <text x="130" y="107" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Raleway">🚀 React.js</text>
        </g>

        <g className="float-item-2">
          <rect x="410" y="100" width="130" height="44" rx="22" fill="rgba(22, 33, 62, 0.85)" stroke="#7f00ff" strokeWidth="1.5" />
          <text x="475" y="127" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Raleway">⚡ Node.js</text>
        </g>

        <g className="float-item-3">
          <rect x="420" y="340" width="120" height="44" rx="22" fill="rgba(22, 33, 62, 0.85)" stroke="#c770f0" strokeWidth="1.5" />
          <text x="480" y="367" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Raleway">🍃 MongoDB</text>
        </g>

        <g className="float-item-4">
          <rect x="60" y="330" width="130" height="44" rx="22" fill="rgba(22, 33, 62, 0.85)" stroke="#7f00ff" strokeWidth="1.5" />
          <text x="125" y="357" fill="#fff" fontSize="13" fontWeight="700" textAnchor="middle" fontFamily="Raleway">📝 Medium UX</text>
        </g>

        {/* Main Laptop & Workspace Graphic */}
        {/* Laptop Screen */}
        <rect x="180" y="160" width="240" height="150" rx="12" fill="#16213e" stroke="#c770f0" strokeWidth="3" />
        <rect x="192" y="172" width="216" height="126" rx="6" fill="#1b1a2e" />

        {/* Code / Article Content lines on Screen */}
        <rect x="210" y="190" width="100" height="10" rx="5" fill="#c770f0" />
        <rect x="210" y="210" width="180" height="6" rx="3" fill="rgba(255,255,255,0.4)" />
        <rect x="210" y="222" width="160" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="210" y="234" width="170" height="6" rx="3" fill="rgba(255,255,255,0.3)" />
        <rect x="210" y="246" width="130" height="6" rx="3" fill="rgba(199, 112, 240, 0.6)" />

        {/* Floating Clap & Heart graphics on Screen */}
        <circle cx="370" cy="200" r="14" fill="rgba(199, 112, 240, 0.25)" stroke="#c770f0" strokeWidth="1" />
        <text x="370" y="205" fill="#c770f0" fontSize="12" textAnchor="middle">👏</text>

        {/* Laptop Base */}
        <path d="M140 310 L460 310 L440 325 L160 325 Z" fill="#222040" stroke="#7f00ff" strokeWidth="2" />
        <rect x="270" y="312" width="60" height="4" rx="2" fill="#c770f0" />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c770f0" />
            <stop offset="100%" stopColor="#7f00ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default HeroIllustration;
