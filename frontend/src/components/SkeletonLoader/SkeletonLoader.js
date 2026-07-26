import React from 'react';
import './SkeletonLoader.css';

export const BlogCardSkeleton = () => (
  <div className="skeleton-wrapper">
    <div className="skeleton-row">
      <div className="skeleton-shimmer skeleton-avatar" />
      <div style={{ flex: 1 }}>
        <div className="skeleton-shimmer skeleton-text short" />
        <div className="skeleton-shimmer skeleton-text short" style={{ width: '25%' }} />
      </div>
    </div>
    <div className="skeleton-shimmer skeleton-text title" />
    <div className="skeleton-shimmer skeleton-text" />
    <div className="skeleton-shimmer skeleton-text medium" />
  </div>
);

export const BlogDetailSkeleton = () => (
  <div className="skeleton-wrapper" style={{ padding: '40px' }}>
    <div className="skeleton-shimmer skeleton-text title" style={{ height: '36px', width: '90%' }} />
    <div className="skeleton-row" style={{ marginTop: '24px' }}>
      <div className="skeleton-shimmer skeleton-avatar" />
      <div style={{ flex: 1 }}>
        <div className="skeleton-shimmer skeleton-text short" />
        <div className="skeleton-shimmer skeleton-text short" style={{ width: '30%' }} />
      </div>
    </div>
    <div className="skeleton-shimmer skeleton-image" style={{ height: '340px' }} />
    <div className="skeleton-shimmer skeleton-text" />
    <div className="skeleton-shimmer skeleton-text" />
    <div className="skeleton-shimmer skeleton-text medium" />
  </div>
);

export default BlogCardSkeleton;
