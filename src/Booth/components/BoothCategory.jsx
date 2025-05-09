import React from 'react';
import './BoothCategory.css';

export default function BoothCategory({ 
  categories, 
  activeCategoryId, 
  onSelect 
}) {
  return (
    <div className="booth-category">
      {categories.map(cat => (
        <button
          key={cat.id}
          className={`category-btn ${cat.id === activeCategoryId ? 'active' : ''}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
