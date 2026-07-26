import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Particle = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      options={{
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: 'repulse' },
            onClick: { enable: true, mode: 'push' },
            resize: true,
          },
          modes: {
            repulse: { distance: 120, duration: 0.4 },
            push:    { quantity: 3 },
          },
        },
        particles: {
          color: { value: '#c770f0' },
          links: {
            color: '#c770f0',
            distance: 150,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          collisions: { enable: false },
          move: {
            direction: 'none',
            enable: true,
            outModes: { default: 'bounce' },
            random: false,
            speed: 1.2,
            straight: false,
          },
          number: {
            density: { enable: true, area: 900 },
            value: 80,
          },
          opacity: {
            value: 0.4,
            animation: { enable: true, speed: 1, minimumValue: 0.1 },
          },
          shape: { type: 'circle' },
          size: {
            value: { min: 1, max: 3 },
            animation: { enable: true, speed: 3, minimumValue: 0.5 },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default Particle;
