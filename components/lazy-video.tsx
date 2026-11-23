'use client';
import { useEffect, useRef, useState, type RefObject, type VideoHTMLAttributes } from 'react';
import { optimizedMedia } from './optimized-image';

type Props = VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  videoRef?: RefObject<HTMLVideoElement | null>;
  playing?: boolean;
};

// Keep the actual source off the element until it approaches the viewport.
export function LazyVideo({ src, videoRef, playing = true, autoPlay: _autoPlay, ...props }: Props) {
  const ownRef = useRef<HTMLVideoElement>(null);
  const ref = videoRef ?? ownRef;
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mobile, setMobile] = useState(false);
  const media = optimizedMedia[src];
  const resolvedSrc = media?.variants[mobile ? 0 : media.variants.length - 1]?.src ?? src;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setMobile(window.matchMedia('(max-width: 650px)').matches);
    if (!('IntersectionObserver' in window)) { setNear(true); setVisible(true); return; }
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: '300px' });
    const playback = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    preload.observe(el);
    playback.observe(el);
    return () => { preload.disconnect(); playback.disconnect(); };
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      if (near && visible && playing && !document.hidden) el.play().catch(() => {});
      else el.pause();
    };
    sync();
    document.addEventListener('visibilitychange', sync);
    return () => { document.removeEventListener('visibilitychange', sync); el.pause(); };
  }, [near, visible, playing, resolvedSrc, ref]);

  return <video {...props} ref={ref} src={near ? resolvedSrc : undefined}
    poster={near ? media?.poster : undefined} preload="none"
    width={props.width ?? media?.width} height={props.height ?? media?.height} />;
}
