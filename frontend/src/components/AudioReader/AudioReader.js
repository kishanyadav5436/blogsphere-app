import React, { useState, useEffect, useRef } from 'react';
import { FiPlay, FiPause, FiSquare, FiVolume2 } from 'react-icons/fi';
import './AudioReader.css';

const AudioReader = ({ title = '', content = '' }) => {
  const [isPlaying, setIsPlaying]   = useState(false);
  const [isPaused, setIsPaused]     = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [supported, setSupported]   = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSupported(false);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Strip HTML tags for clean speech synthesis
  const cleanText = (htmlStr) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = htmlStr;
    return tmp.textContent || tmp.innerText || '';
  };

  const handlePlay = () => {
    if (!supported) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const textToRead = `${title}. ${cleanText(content)}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = playbackRate;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      handleStop();
      setTimeout(handlePlay, 100);
    }
  };

  if (!supported) return null;

  return (
    <div className="audio-reader-widget glass-card">
      <div className="audio-reader-info">
        <div className="audio-icon-wrap">
          <FiVolume2 className="volume-icon" />
        </div>
        <div>
          <h5 className="audio-title">Audio Reader</h5>
          <p className="audio-subtitle">Listen to this article with AI speech synthesis</p>
        </div>
      </div>

      <div className="audio-controls">
        {isPlaying ? (
          <button className="audio-btn pause" onClick={handlePause} title="Pause">
            <FiPause /> Pause
          </button>
        ) : (
          <button className="audio-btn play" onClick={handlePlay} title="Listen">
            <FiPlay /> {isPaused ? 'Resume' : 'Listen'}
          </button>
        )}

        {(isPlaying || isPaused) && (
          <button className="audio-btn stop" onClick={handleStop} title="Stop">
            <FiSquare />
          </button>
        )}

        {/* Speed Selector */}
        <div className="speed-selector">
          {[1, 1.25, 1.5, 2].map((speed) => (
            <button
              key={speed}
              className={`speed-btn ${playbackRate === speed ? 'active' : ''}`}
              onClick={() => handleSpeedChange(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioReader;
