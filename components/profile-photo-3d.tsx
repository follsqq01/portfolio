'use client';
import { OptimizedImage } from './optimized-image';
import { useRef, useState } from 'react';

interface ProfilePhoto3DProps {
  src: string;
  alt: string;
  variant?: 'profile' | 'archive';
}

export function ProfilePhoto3D({ src, alt, variant = 'profile' }: ProfilePhoto3DProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (e.pointerType !== 'mouse' && !e.currentTarget.hasPointerCapture(e.pointerId)) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (!centerX || !centerY) return;
    const rotateX = Math.max(-1, Math.min(1, (y - centerY) / centerY)) * -16;
    const rotateY = Math.max(-1, Math.min(1, (x - centerX) / centerX)) * 16;

    setTransform(`perspective(600px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.05, 1.05, 1.05)`);
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.38,
    });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTransform('perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      className={variant === 'archive' ? 'archive-photo-3d-wrap' : 'profile-photo-3d-wrap'}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerDown={(e) => {
        if (e.pointerType === 'mouse') return;
        e.currentTarget.setPointerCapture(e.pointerId);
        handlePointerEnter();
        handlePointerMove(e);
      }}
      onPointerUp={(e) => {
        if (e.pointerType === 'mouse') return;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
        handlePointerLeave();
      }}
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: transform || undefined,
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      <OptimizedImage sizes="80px" className={variant === 'archive' ? 'archive-photo' : 'profile-photo'} src={src} alt={alt} draggable={false} />
      <div
        className="profile-photo-glare"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 70%)`,
          opacity: glare.opacity,
          transition: isHovered ? 'opacity 0.15s ease' : 'opacity 0.4s ease',
        }}
        aria-hidden="true"
      />
    </div>
  );
}
