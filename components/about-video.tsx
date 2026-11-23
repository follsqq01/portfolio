'use client';
import { useRef, useState } from 'react';
import { LazyVideo } from './lazy-video';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from './language';

const videos = [
  {
    id: 'about-1',
    src: '/media/preview_wallap-6ca4fd42.mp4',
    num: '01',
    label: '1',
    titleRu: 'Шоурил',
    titleEn: 'Showreel',
  },
  {
    id: 'about-2',
    src: '/media/aboutme-c7c8d589.mp4',
    num: '02',
    label: '2',
    titleRu: 'Видеовизитка',
    titleEn: 'About Me',
  },
];

export function AboutVideo() {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = videos[activeIdx];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const switchVideo = (idx: number) => {
    setActiveIdx(idx);
    setIsPlaying(true);

  };

  return (
    <section className="about-video">
      <div className="about-video-head">
        <div className="about-video-title-wrap">
          <span className="mono">03 / MOTION</span>
          <h2>{t(current.titleRu, current.titleEn)}</h2>
        </div>
        <div className="about-video-switch mono" role="tablist">
          {videos.map((v, i) => (
            <button
              key={v.id}
              type="button"
              className={activeIdx === i ? 'is-active' : ''}
              onClick={() => switchVideo(i)}
              aria-pressed={activeIdx === i}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="about-video-frame">
        <LazyVideo
          videoRef={videoRef}
          playing={isPlaying}
          src={current.src}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onClick={togglePlay}
          aria-label={t(current.titleRu, current.titleEn)}
        />
        <div className="about-video-controls mono">
          <div className="about-video-controls-left">
            <button
              type="button"
              className="about-video-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? t('Пауза', 'Pause') : t('Воспроизвести', 'Play')}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <button
              type="button"
              className="about-video-btn"
              onClick={toggleMute}
              aria-label={isMuted ? t('Включить звук', 'Unmute') : t('Выключить звук', 'Mute')}
            >
              {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              <span>{isMuted ? 'MUTE' : 'SOUND ON'}</span>
            </button>
          </div>
          <div className="about-video-controls-right">
            <span>RUSLAN / 2026</span>
          </div>
        </div>
      </div>
    </section>
  );
}
