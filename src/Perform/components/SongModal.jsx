import React from 'react';
import './SongModal.css';

function highlightText(text) {
  const parts = text.split(/(\*\*.*?\*\*)/).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={index} className="sm-highlight">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
  return parts;
}

export default function SongModal({ song, artistName, lyrics, onClose }) {
  // 가사를 줄바꿈으로 분리하고 2줄씩 묶기
  const lines = lyrics.split('\n').filter(line => line.trim() !== '');
  const chunks = [];
  for (let i = 0; i < lines.length; i += 2) {
    chunks.push(lines.slice(i, i + 2));
  }

  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-sheet" onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="sm-header">
          <div className="sm-header-spacer" />
          <div className="sm-header-title">가사 보기</div>
          <button className="sm-close-btn" onClick={onClose}>닫기</button>
        </div>
        {/* 곡 정보 */}
        <div className="sm-info">
          <img src={song.imageUrl} alt={song.title} className="sm-cover" />
          <div className="sm-meta">
            <div className="sm-title">{song.title}</div>
            <div className="sm-artist">{artistName}</div>
          </div>
        </div>
        {/* 가사 */}
        <div className="sm-lyrics">
          {chunks.map((pair, idx) => (
            <div key={idx} className="sm-line-group">
              {pair.map((line, j) => (
                <p key={j} className="sm-line">
                  {highlightText(line)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
