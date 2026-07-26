import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { PiHandsClappingFill, PiHandsClapping } from 'react-icons/pi';
import toast from 'react-hot-toast';
import './ClapButton.css';

const ClapButton = ({ postId, initialTotalClaps = 0, initialUserClaps = 0, onClapUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [totalClaps, setTotalClaps] = useState(initialTotalClaps);
  const [userClaps, setUserClaps] = useState(initialUserClaps);
  const [sessionClaps, setSessionClaps] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [burstList, setBurstList] = useState([]);
  
  const timerRef = useRef(null);
  const pendingClapsRef = useRef(0);

  useEffect(() => {
    setTotalClaps(initialTotalClaps);
  }, [initialTotalClaps]);

  useEffect(() => {
    setUserClaps(initialUserClaps);
  }, [initialUserClaps]);

  const sendClapsToApi = async (count) => {
    try {
      const { data } = await axios.put(`/api/posts/${postId}/clap`, { count });
      setTotalClaps(data.totalClaps);
      setUserClaps(data.userClaps);
      if (onClapUpdate) onClapUpdate(data.totalClaps);
    } catch {
      toast.error('Failed to register claps');
    }
  };

  const handleClap = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to clap for this story');
      return;
    }

    if (userClaps + pendingClapsRef.current >= 50) {
      toast('Maximum 50 claps reached for this story! 👏', { icon: '👏' });
      return;
    }

    // Incremental state
    pendingClapsRef.current += 1;
    setTotalClaps((prev) => prev + 1);
    setUserClaps((prev) => prev + 1);
    setSessionClaps((prev) => prev + 1);

    // Burst visual animation item
    const id = Date.now() + Math.random();
    setBurstList((prev) => [...prev.slice(-4), { id, text: `+${pendingClapsRef.current}` }]);

    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);

    // Debounce API update
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sendClapsToApi(pendingClapsRef.current);
      pendingClapsRef.current = 0;
      setTimeout(() => setSessionClaps(0), 1000);
    }, 600);
  };

  return (
    <div className="clap-container">
      <button
        className={`clap-btn ${userClaps > 0 ? 'clapped' : ''} ${animating ? 'bounce' : ''}`}
        onClick={handleClap}
        title={userClaps >= 50 ? 'Max claps given (50)' : 'Clap for this story'}
      >
        {userClaps > 0 ? <PiHandsClappingFill className="clap-icon" /> : <PiHandsClapping className="clap-icon" />}
        <span className="clap-count">{totalClaps}</span>
      </button>

      {/* Floating session indicator (+1 counter) */}
      {sessionClaps > 0 && (
        <span className="session-clap-badge">+{sessionClaps}</span>
      )}

      {/* Burst particles */}
      {burstList.map((b) => (
        <span key={b.id} className="clap-float-num">
          {b.text}
        </span>
      ))}
    </div>
  );
};

export default ClapButton;
