import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './ScheduleDetailModal.css';

export default function ScheduleDetailModal({
  isOpen,
  onClose,
  event,
  animationDuration = 500, // duration in ms
}) {
  const [dragY, setDragY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const isTouch = useRef(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setDragY(0);
      setIsAnimating(false);
    }
    return cleanup;
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleDragStart = (e) => {
    if (isAnimating) return;
    isTouch.current = !!e.touches;
    const clientY = isTouch.current ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    lastY.current = clientY;
    if (isTouch.current) {
      document.addEventListener('touchmove', handleDragging, { passive: false });
      document.addEventListener('touchend', handleDragEnd);
    } else {
      document.addEventListener('mousemove', handleDragging);
      document.addEventListener('mouseup', handleDragEnd);
    }
  };

  const handleDragging = (e) => {
    const clientY = isTouch.current ? e.touches[0].clientY : e.clientY;
    lastY.current = clientY;
    const delta = clientY - startY.current;
    if (delta > 0) {
      e.preventDefault();
      setDragY(delta);
    }
  };

  const handleDragEnd = () => {
    cleanup();
    const screenY = window.innerHeight;
    if (
      lastY.current > screenY - 50 ||
      dragY > (modalRef.current?.offsetHeight || 0) / 2
    ) {
      triggerCloseAnimation();
    } else {
      setDragY(0);
    }
  };

  const triggerCloseAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDragY(window.innerHeight);
  };

  const handleTransitionEnd = () => {
    if (isAnimating) {
      onClose();
    }
  };

  const cleanup = () => {
    document.removeEventListener('touchmove', handleDragging);
    document.removeEventListener('touchend', handleDragEnd);
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const transitionStyle = isAnimating
    ? `transform ${animationDuration}ms ease-out`
    : dragY > 0
    ? 'none'
    : `transform ${animationDuration}ms ease-out`;

  return ReactDOM.createPortal(
    <div className="modal-overlay visible" onClick={triggerCloseAnimation}>
      <div
        ref={modalRef}
        className="detail-modal open"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: transitionStyle,
        }}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={handleTransitionEnd}
      >
        <div
          className="modal-handle"
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          onClick={triggerCloseAnimation}
          style={{ cursor: 'pointer' }}
        />

        <div className="modal-header">
          <img src={event.imageUrl} alt={event.title} className="modal-image" />
          <div className="modal-title-group">
            <h2 className="modal-title">{event.title}</h2>
            <p className="modal-time">{`${event.start} - ${event.end}`}</p>
          </div>
        </div>

        <div className="modal-body">
          <p className="modal-desc" style={{ whiteSpace: 'pre-line' }}>
            {event.description}
          </p>
        </div>

        <div className="modal-footer">
          <a
            href={event.linkUrl}
            target="_blank"
            rel="noreferrer"
            className="modal-action-btn"
          >
            {event.buttonLabel || '동아리 인스타그램 보러가기'}
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}

ScheduleDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  event: PropTypes.shape({
    title: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
    imageUrl: PropTypes.string,
    description: PropTypes.string,
    linkUrl: PropTypes.string,
    buttonLabel: PropTypes.string,
  }),
  animationDuration: PropTypes.number, // animation duration in ms
};
