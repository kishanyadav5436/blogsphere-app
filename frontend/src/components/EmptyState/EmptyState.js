import React from 'react';
import { Link } from 'react-router-dom';
import { FiInbox } from 'react-icons/fi';
import './EmptyState.css';

const EmptyState = ({
  icon = <FiInbox />,
  title = 'No items found',
  subtitle = 'There are no stories or items to display at the moment.',
  actionLabel,
  actionLink,
  onActionClick,
}) => {
  return (
    <div className="empty-state-container">
      <div className="empty-state-icon-wrapper">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-subtitle">{subtitle}</p>

      {actionLabel && actionLink && (
        <Link to={actionLink} className="empty-state-action-btn">
          {actionLabel}
        </Link>
      )}

      {actionLabel && !actionLink && onActionClick && (
        <button className="empty-state-action-btn" onClick={onActionClick}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
