'use client';
import { useEffect, useRef, useState, type IframeHTMLAttributes } from 'react';

export function LazyEmbed({ src, ...props }: IframeHTMLAttributes<HTMLIFrameElement>) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (!('IntersectionObserver' in window)) { setNear(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); observer.disconnect(); }
    }, { rootMargin: '300px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <iframe {...props} ref={ref} src={near ? src : undefined} loading="lazy" />;
}
