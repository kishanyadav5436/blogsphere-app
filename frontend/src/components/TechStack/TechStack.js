import React from 'react';
import { FaReact, FaNodeJs, FaPython, FaGitAlt } from 'react-icons/fa';
import { SiJavascript, SiMongodb, SiExpress, SiTypescript } from 'react-icons/si';
import './TechStack.css';

const STACK = [
  { name: 'JavaScript', icon: <SiJavascript style={{ color: '#f7df1e' }} /> },
  { name: 'React.js', icon: <FaReact style={{ color: '#61dafb' }} /> },
  { name: 'Node.js', icon: <FaNodeJs style={{ color: '#339933' }} /> },
  { name: 'MongoDB', icon: <SiMongodb style={{ color: '#47a248' }} /> },
  { name: 'Express.js', icon: <SiExpress style={{ color: '#ffffff' }} /> },
  { name: 'TypeScript', icon: <SiTypescript style={{ color: '#3178c6' }} /> },
  { name: 'Python', icon: <FaPython style={{ color: '#3776ab' }} /> },
  { name: 'Git', icon: <FaGitAlt style={{ color: '#f05032' }} /> },
];

const TechStack = () => {
  return (
    <div className="tech-stack-section">
      <h2 className="section-title animate-fadeInUp">
        Tech <span className="gradient-text">Stack</span> &amp; Platform Engine
      </h2>
      <p className="section-subtitle animate-fadeInUp delay-1">
        Technologies powering our modern full-stack blogging architecture
      </p>

      <div className="tech-grid">
        {STACK.map((tech, idx) => (
          <div key={tech.name} className="tech-card glass-card animate-fadeInUp" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="tech-icon">{tech.icon}</div>
            <span className="tech-name">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
