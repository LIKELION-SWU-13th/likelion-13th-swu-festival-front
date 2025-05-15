import React, { useRef, useEffect, useState } from 'react';
import './ShootingStars.css';

export default function ShootingStars({ duration = 6000, fadeDuration = 1200, onComplete = () => {} }) {
  const canvasBgRef = useRef();
  const canvasFgRef = useRef();
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const bgCanvas = canvasBgRef.current;
    const fgCanvas = canvasFgRef.current;
    const bgCtx = bgCanvas.getContext('2d');
    const fgCtx = fgCanvas.getContext('2d');
    let bgStars = [];
    let shootingStars = [];
    let w, h;
    let animId;

    function init() {
      w = bgCanvas.width = fgCanvas.width = window.innerWidth;
      h = bgCanvas.height = fgCanvas.height = window.innerHeight;

      // static background stars with flicker
      bgStars = Array.from({ length: 120 }).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.5,
        alpha: Math.random() * 0.5 + 0.3,
        flicker: (Math.random() * 0.02) + 0.005
      }));

      // shooting stars: fewer but larger and slower
      const centerAngle = Math.PI / 2;  // downward
      const spread = Math.PI / 8;       // narrower ±22.5°
      shootingStars = Array.from({ length: 4 }).map(() => {
        const startX = Math.random() * w;
        return {
          x: startX,
          y: Math.random() * h * 0.3,
          len: Math.random() * 200 + 100,    // larger length
          speed: Math.random() * 2 + 1.5,    // slower speed
          angle: centerAngle + (Math.random() * spread * 2 - spread),
          alpha: 0,
          fadeIn: true
        };
      });
    }

    function drawBackground() {
      bgCtx.clearRect(0, 0, w, h);
      bgStars.forEach(s => {
        // flicker effect
        s.alpha += (Math.random() > 0.5 ? 1 : -1) * s.flicker;
        s.alpha = Math.max(0.2, Math.min(1, s.alpha));
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        bgCtx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        bgCtx.fill();
      });
    }

    function drawForeground() {
      fgCtx.clearRect(0, 0, w, h);
      shootingStars.forEach(star => {
        if (star.fadeIn) star.alpha += 0.02;
        else star.alpha -= 0.02;
        if (star.alpha >= 1) star.fadeIn = false;

        const endX = star.x + Math.cos(star.angle) * star.len;
        const endY = star.y + Math.sin(star.angle) * star.len;
        const gradient = fgCtx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, `rgba(255,255,220,${star.alpha})`);
        gradient.addColorStop(1, 'rgba(255,255,220,0)');
        fgCtx.strokeStyle = gradient;
        fgCtx.lineWidth = 3;
        fgCtx.beginPath();
        fgCtx.moveTo(star.x, star.y);
        fgCtx.lineTo(endX, endY);
        fgCtx.stroke();

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;

        if (star.x < -star.len || star.y > h + star.len || star.alpha <= 0) {
          star.x = Math.random() * w;
          star.y = Math.random() * h * 0.3;
          star.alpha = 0;
          star.fadeIn = true;
        }
      });
    }

    function loop() {
      drawBackground();
      drawForeground();
      animId = requestAnimationFrame(loop);
    }

    init();
    loop();

    const fadeTimeout = setTimeout(() => setFade(true), duration - fadeDuration);
    const endTimeout = setTimeout(() => { cancelAnimationFrame(animId); onComplete(); }, duration);

    window.addEventListener('resize', () => { cancelAnimationFrame(animId); init(); loop(); });

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(endTimeout);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', init);
    };
  }, [duration, fadeDuration, onComplete]);

  return (
    <div className="shooting-stars-container" style={{ opacity: fade ? 0 : 1, transition: `opacity ${fadeDuration}ms ease-out` }}>
      <canvas ref={canvasBgRef} className="shooting-stars-canvas bg" />
      <canvas ref={canvasFgRef} className="shooting-stars-canvas fg" />
    </div>
  );
}