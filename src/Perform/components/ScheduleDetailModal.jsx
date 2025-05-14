import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './ScheduleDetailModal.css';

export default function ScheduleDetailModal({ isOpen, onClose, event }) {
  const [dragY, setDragY] = useState(0);
  const startYRef = useRef(null);

  useEffect(() => {
    if (!isOpen) setDragY(0);
  }, [isOpen]);

  if (!isOpen || !event) return null;

  // 드래그 시작/중/끝 로직 그대로
  const handleDragStart = e => { /* … */ };
  const handleDragging  = e => { /* … */ };
  const handleDragEnd   = () => { /* … */ };

  const modal = (
    <div className="modal-overlay visible" onClick={onClose}>
      <div
        className="detail-modal open"
        style={{ transform: `translateY(${dragY}px)` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-handle" onMouseDown={handleDragStart} onTouchStart={handleDragStart} />
        <div className="modal-header">
          <img src={event.imageUrl} alt={event.title} className="modal-image" />
          <div className="modal-title-group">
            <h2 className="modal-title">{event.title}</h2>
            <p className="modal-time">{`${event.start} - ${event.end}`}</p>
          </div>
        </div>
        <div className="modal-body">
          <p className="modal-desc">{event.description}</p>
        </div>
        <div className="modal-footer">
          <a href={event.linkUrl} target="_blank" rel="noreferrer" className="modal-action-btn">
            {event.buttonLabel}
          </a>
        </div>
      </div>
    </div>
  );

  // container 검사 삭제 → 항상 body에 포탈
  return ReactDOM.createPortal(modal, document.body);
}

ScheduleDetailModal.propTypes = {
  isOpen:     PropTypes.bool.isRequired,
  onClose:    PropTypes.func.isRequired,
  event:      PropTypes.object,
};
