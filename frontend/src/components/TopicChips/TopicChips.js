import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TopicChips.css';

const DEFAULT_TOPICS = [
  'All',
  'Technology',
  'Coding',
  'AI',
  'Web Development',
  'Design',
  'Productivity',
  'Data Science',
  'Career',
  'Life',
];

const TopicChips = ({ activeTopic = 'All', onSelectTopic, topics = DEFAULT_TOPICS }) => {
  const navigate = useNavigate();

  const handleClick = (topic) => {
    if (onSelectTopic) {
      onSelectTopic(topic === 'All' ? '' : topic);
    } else {
      if (topic === 'All') {
        navigate('/blog');
      } else {
        navigate(`/blog?tag=${encodeURIComponent(topic)}`);
      }
    }
  };

  return (
    <div className="topic-chips-wrapper">
      <div className="topic-chips-scroll">
        {topics.map((topic) => {
          const isActive = (activeTopic === '' && topic === 'All') || activeTopic.toLowerCase() === topic.toLowerCase();
          return (
            <button
              key={topic}
              className={`topic-chip ${isActive ? 'active' : ''}`}
              onClick={() => handleClick(topic)}
            >
              {topic}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TopicChips;
