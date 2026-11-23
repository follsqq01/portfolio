'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { LazyVideo } from './lazy-video';
import { OptimizedImage } from './optimized-image';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useLanguage } from './language';
import { useSound } from './sound-provider';

type Item = {
  id: string;
  src: string;
  type: 'image' | 'video';
  shape: string;
  initLeft: number; // percentage
  initTop: number;  // percentage
  initRotate: number;
};

const itemsData: Item[] = [
  { id: 'dog', src: '/media/about/img1.webp', type: 'image', shape: 'cutout wide', initLeft: 1, initTop: 0, initRotate: -5 },
  { id: 'vid1', src: '/media/about/vid1.mp4', type: 'video', shape: 'circle', initLeft: 37, initTop: 6, initRotate: 0 },
  { id: 'cats', src: '/media/about/img3.webp', type: 'image', shape: 'square', initLeft: 71, initTop: 12, initRotate: 7 },
  { id: 'kitchen', src: '/media/about/img4.webp', type: 'image', shape: 'wide', initLeft: 11, initTop: 42, initRotate: 5 },
  { id: 'tg1', src: '/media/about/tg1.webp', type: 'image', shape: 'square', initLeft: 46, initTop: 40, initRotate: -7 },
  { id: 'vid3', src: '/media/about/vid3.mp4', type: 'video', shape: 'circle', initLeft: 74, initTop: 48, initRotate: 0 },
  { id: 'vid2', src: '/media/about/vid2.mp4', type: 'video', shape: 'circle', initLeft: 4, initTop: 60, initRotate: 0 },
  { id: 'tg2', src: '/media/about/tg2.webp', type: 'image', shape: 'square', initLeft: 29, initTop: 70, initRotate: 6 },
  { id: 'bear', src: '/media/about/img2.webp', type: 'image', shape: 'cutout portrait', initLeft: 65, initTop: 64, initRotate: -4 },
];

interface PhysicsBody {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotate: number;
  vRotate: number;
  width: number;
  height: number;
  isResting: boolean;
}

export function AboutMoodboard() {
  const { lang, t } = useLanguage();
  const { playThud, playSwitch, playDragRustle } = useSound();
  const areaRef = useRef<HTMLDivElement>(null);

  // Drag positions when physics is OFF
  const [dragPositions, setDragPositions] = useState<Record<number, { x: number; y: number }>>({});
  const [active, setActive] = useState<number | null>(null);

  // Physics state
  const [isGravityActive, setIsGravityActive] = useState(false);
  const [physicsBodies, setPhysicsBodies] = useState<Record<number, { x: number; y: number; rotate: number }>>({});

  const simRef = useRef<{
    bodies: PhysicsBody[];
    rafId: number | null;
    dragIdx: number | null;
    lastMouseX: number;
    lastMouseY: number;
    mouseVx: number;
    mouseVy: number;
  }>({
    bodies: [],
    rafId: null,
    dragIdx: null,
    lastMouseX: 0,
    lastMouseY: 0,
    mouseVx: 0,
    mouseVy: 0,
  });

  // Enable Gravity
  const enableGravity = () => {
    const area = areaRef.current;
    if (!area) return;
    const areaRect = area.getBoundingClientRect();
    const areaW = areaRect.width;
    const areaH = areaRect.height;

    const itemElements = area.querySelectorAll<HTMLElement>('.mood-item');

    const bodies: PhysicsBody[] = itemsData.map((item, idx) => {
      const el = itemElements[idx];
      const elRect = el ? el.getBoundingClientRect() : null;
      const w = elRect ? elRect.width : 160;
      const h = elRect ? elRect.height : 160;

      // Compute current position relative to container
      const currentLeft = (item.initLeft / 100) * areaW + (dragPositions[idx]?.x || 0);
      const currentTop = (item.initTop / 100) * areaH + (dragPositions[idx]?.y || 0);

      return {
        x: Math.max(0, Math.min(areaW - w, currentLeft)),
        y: Math.max(0, currentTop),
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 3,
        rotate: item.initRotate,
        vRotate: (Math.random() - 0.5) * 4,
        width: w,
        height: h,
        isResting: false,
      };
    });

    simRef.current.bodies = bodies;
    setIsGravityActive(true);
  };

  // Reset to original layout
  const resetGravity = () => {
    if (simRef.current.rafId) {
      cancelAnimationFrame(simRef.current.rafId);
      simRef.current.rafId = null;
    }
    setIsGravityActive(false);
    setPhysicsBodies({});
    setDragPositions({});
    setActive(null);
  };

  // Physics animation loop
  useEffect(() => {
    if (!isGravityActive) return;

    const gravity = 0.58;
    const friction = 0.985;
    const bounce = 0.42;

    const tick = () => {
      const area = areaRef.current;
      if (!area) return;
      const areaW = area.clientWidth;
      const areaH = area.clientHeight;
      const floorY = areaH;

      const bodies = simRef.current.bodies;
      const updatedMap: Record<number, { x: number; y: number; rotate: number }> = {};

      bodies.forEach((b, idx) => {
        if (simRef.current.dragIdx === idx) {
          // Being dragged: follow mouse
          updatedMap[idx] = { x: b.x, y: b.y, rotate: b.rotate };
          return;
        }

        // Apply gravity
        b.vy += gravity;
        b.vx *= friction;
        b.vy *= friction;
        b.vRotate *= 0.97;

        b.x += b.vx;
        b.y += b.vy;
        b.rotate += b.vRotate;

        // Bottom floor collision
        const bottomEdge = b.y + b.height;
        if (bottomEdge >= floorY) {
          if (b.vy > 1.8) {
            playThud(Math.min(b.vy / 10, 1.2));
          }
          b.y = floorY - b.height;
          b.vy = -b.vy * bounce;
          b.vx *= 0.88; // floor friction
          b.vRotate *= 0.85;

          // Settle if energy is small
          if (Math.abs(b.vy) < 0.6) {
            b.vy = 0;
            if (Math.abs(b.vx) < 0.2) b.vx = 0;
          }
        }

        // Left wall collision
        if (b.x <= 0) {
          b.x = 0;
          b.vx = -b.vx * bounce;
        }

        // Right wall collision
        if (b.x + b.width >= areaW) {
          b.x = areaW - b.width;
          b.vx = -b.vx * bounce;
        }

        updatedMap[idx] = { x: b.x, y: b.y, rotate: b.rotate };
      });

      setPhysicsBodies(updatedMap);
      simRef.current.rafId = requestAnimationFrame(tick);
    };

    simRef.current.rafId = requestAnimationFrame(tick);

    return () => {
      if (simRef.current.rafId) {
        cancelAnimationFrame(simRef.current.rafId);
        simRef.current.rafId = null;
      }
    };
  }, [isGravityActive]);

  // Pointer interactions (works both in physics and normal mode)
  const handlePointerDown = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    setActive(index);
    playDragRustle();

    if (isGravityActive) {
      simRef.current.dragIdx = index;
      simRef.current.lastMouseX = e.clientX;
      simRef.current.lastMouseY = e.clientY;
      simRef.current.mouseVx = 0;
      simRef.current.mouseVy = 0;
    } else {
      el.dataset.startX = String(e.clientX);
      el.dataset.startY = String(e.clientY);
    }
  };

  const handlePointerMove = (index: number, e: React.PointerEvent<HTMLDivElement>) => {
    if (active !== index) return;

    if (isGravityActive) {
      const b = simRef.current.bodies[index];
      if (!b) return;

      const dx = e.clientX - simRef.current.lastMouseX;
      const dy = e.clientY - simRef.current.lastMouseY;

      b.x += dx;
      b.y += dy;
      b.rotate += dx * 0.15;

      // Track velocity for throw impulse
      simRef.current.mouseVx = dx * 0.8;
      simRef.current.mouseVy = dy * 0.8;
      simRef.current.lastMouseX = e.clientX;
      simRef.current.lastMouseY = e.clientY;
    } else {
      const el = e.currentTarget;
      const sx = Number(el.dataset.startX || e.clientX);
      const sy = Number(el.dataset.startY || e.clientY);
      setDragPositions((prev) => ({
        ...prev,
        [index]: {
          x: (prev[index]?.x || 0) + e.clientX - sx,
          y: (prev[index]?.y || 0) + e.clientY - sy,
        },
      }));
      el.dataset.startX = String(e.clientX);
      el.dataset.startY = String(e.clientY);
    }
  };

  const handlePointerUp = (index: number) => {
    if (active === index) {
      playThud(0.5);
    }
    setActive(null);
    if (isGravityActive && simRef.current.dragIdx === index) {
      const b = simRef.current.bodies[index];
      if (b) {
        // Release with throw impulse!
        b.vx = Math.max(-16, Math.min(16, simRef.current.mouseVx));
        b.vy = Math.max(-16, Math.min(16, simRef.current.mouseVy));
        b.vRotate = (Math.random() - 0.5) * 6;
      }
      simRef.current.dragIdx = null;
    }
  };

  return (
    <section className="about-moodboard">
      <div className="moodboard-head">
        <div className="moodboard-controls">
          <button
            type="button"
            className={`moodboard-gravity-btn mono ${isGravityActive ? 'is-active' : ''}`}
            onClick={isGravityActive ? resetGravity : enableGravity}
            title={isGravityActive ? t('Вернуть всё на места', 'Reset positions') : t('Включить гравитацию', 'Drop everything')}
            aria-label={isGravityActive ? t('Вернуть всё на места', 'Reset positions') : t('Включить гравитацию', 'Drop everything')}
          >
            {isGravityActive ? (
              <>
                <RotateCcw size={12} />
              </>
            ) : (
              <>
                <Sparkles size={12} />
              </>
            )}
          </button>
        </div>
      </div>

      <div ref={areaRef} className={`moodboard-area ${isGravityActive ? 'is-physics-active' : ''}`}>
        {itemsData.map((item, index) => {
          let style: React.CSSProperties = {};

          if (isGravityActive) {
            const body = physicsBodies[index];
            if (body) {
              style = {
                left: 0,
                top: 0,
                transform: `translate3d(${body.x}px, ${body.y}px, 0) rotate(${body.rotate}deg)`,
                transition: active === index ? 'none' : undefined,
              };
            }
          } else {
            const pos = dragPositions[index] || { x: 0, y: 0 };
            style = {
              left: `${item.initLeft}%`,
              top: `${item.initTop}%`,
              transform: `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${item.initRotate}deg)`,
              transition: active === index ? 'none' : 'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1)',
            };
          }

          return (
            <div
              key={item.id}
              className={`mood-item ${item.shape}${active === index ? ' is-dragging' : ''}`}
              style={style}
              onPointerDown={(e) => handlePointerDown(index, e)}
              onPointerMove={(e) => handlePointerMove(index, e)}
              onPointerUp={() => handlePointerUp(index)}
              onPointerCancel={() => handlePointerUp(index)}
            >
              {item.type === 'video' ? (
                <LazyVideo src={item.src} autoPlay loop muted playsInline aria-hidden="true" />
              ) : (
                <OptimizedImage loading="lazy" sizes="240px" src={item.src} alt="" draggable="false" />
              )}
            </div>
          );
        })}
        <div className="moodboard-note mono">RUSLAN / 2026</div>
      </div>
    </section>
  );
}
