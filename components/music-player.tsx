'use client';
import { typography } from '../lib/typography';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, ListMusic, Volume2, VolumeX, Disc, ChevronUp, Minus } from 'lucide-react';
import { useLanguage } from './language';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: string;
  duration: string;
  cover: string;
  audioSrc: string;
}

export const defaultTracks: Track[] = [
  {
    id: 'olivia-rodrigo',
    title: 'stupid song',
    artist: 'Olivia Rodrigo',
    album: 'GUTS',
    year: '2024',
    duration: '2:46',
    cover: '/media/music/olivia-rodrigo.svg',
    audioSrc: '/audio/olivia-rodrigo-stupid-song.mp3',
  },
  {
    id: 'bicep-glue',
    title: 'Glue',
    artist: 'Bicep',
    album: 'Bicep',
    year: '2017',
    duration: '4:29',
    cover: '/media/music/bicep-glue.svg',
    audioSrc: '/audio/bicep-glue.mp3',
  },
  {
    id: 'aphex-twin',
    title: 'Alberto Balsalm',
    artist: 'Aphex Twin',
    album: '...I Care Because You Do',
    year: '1995',
    duration: '5:11',
    cover: '/media/music/aphex-twin.svg',
    audioSrc: '/audio/aphex-twin-alberto-balsalm.mp3',
  },
  {
    id: 'fred-again',
    title: 'Danielle (smile on my face)',
    artist: 'Fred again..',
    album: 'Actual Life 3',
    year: '2022',
    duration: '3:21',
    cover: '/media/music/fred-again.svg',
    audioSrc: '/audio/fred-again-danielle.mp3',
  },
];

const DEMO_AUDIO = '/audio/demo-track.wav';

export function MusicPlayer() {
  const { lang, t } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = defaultTracks[currentIdx];

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = currentTrack.audioSrc;
    audioRef.current.load();
    if (isPlaying) {
      audioRef.current.play().catch(() => {
        if (audioRef.current) {
          audioRef.current.src = DEMO_AUDIO;
          audioRef.current.play().catch(() => {});
        }
      });
    }
  }, [currentIdx]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        if (audioRef.current) {
          audioRef.current.src = DEMO_AUDIO;
          audioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {});
        }
      });
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? defaultTracks.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.SyntheticEvent) => {
    e?.stopPropagation();
    setCurrentIdx((prev) => (prev === defaultTracks.length - 1 ? 0 : prev + 1));
  };

  const selectTrack = (idx: number) => {
    setCurrentIdx(idx);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleAudioError = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.src.endsWith(DEMO_AUDIO)) {
      audioRef.current.src = DEMO_AUDIO;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs <= 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <aside className="floating-music-widget" aria-label={t('Музыкальный плеер', 'Music Player')}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
        onError={handleAudioError}
        muted={isMuted}
      />

      {/* Collapsed Pill View */}
      {!isExpanded ? (
        <button
          type="button"
          className="widget-pill"
          onClick={() => setIsExpanded(true)}
          aria-label={t('Развернуть плеер', 'Expand player')}
        >
          <div className="widget-pill-cover">
            <img src={currentTrack.cover} alt="" />
            {isPlaying && <Disc size={11} className="pill-disc disc-spin" />}
          </div>
          <div className="widget-pill-info">
            <span className="widget-pill-title">{typography(currentTrack.title)}</span>
            <span className="widget-pill-artist mono">{typography(currentTrack.artist)}</span>
          </div>
          {isPlaying && (
            <div className="music-eq" aria-hidden="true">
              <span className="music-eq-bar bar-1" />
              <span className="music-eq-bar bar-2" />
              <span className="music-eq-bar bar-3" />
            </div>
          )}
          <button
            type="button"
            className="widget-pill-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? t('Пауза', 'Pause') : t('Играть', 'Play')}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <ChevronUp size={13} className="widget-pill-chevron" />
        </button>
      ) : (
        /* Expanded Card View */
        <div className="widget-card">
          <div className="widget-card-top">
            <div className="widget-card-status mono">
              <span className={`status-dot ${isPlaying ? 'is-active' : ''}`} />
              <span>{t('СЕЙЧАС ИГРАЕТ', 'NOW PLAYING')}</span>
              {isPlaying && (
                <div className="music-eq" aria-hidden="true">
                  <span className="music-eq-bar bar-1" />
                  <span className="music-eq-bar bar-2" />
                  <span className="music-eq-bar bar-3" />
                  <span className="music-eq-bar bar-4" />
                </div>
              )}
            </div>
            <div className="widget-card-actions">
              <button
                type="button"
                className={`widget-action-btn mono ${isPlaylistOpen ? 'is-active' : ''}`}
                onClick={() => setIsPlaylistOpen(!isPlaylistOpen)}
                aria-label={t('Список треков', 'Track list')}
                title={t('Плейлист', 'Playlist')}
              >
                <ListMusic size={12} />
                <span>{defaultTracks.length}</span>
              </button>
              <button
                type="button"
                className="widget-action-btn"
                onClick={() => setIsExpanded(false)}
                aria-label={t('Свернуть', 'Minimize')}
                title={t('Свернуть', 'Minimize')}
              >
                <Minus size={13} />
              </button>
            </div>
          </div>

          <div className="widget-card-main">
            <div className={`widget-cover ${isPlaying ? 'is-playing' : ''}`}>
              <img src={currentTrack.cover} alt={`${currentTrack.title} cover`} />
              <div className="widget-disc-badge">
                <Disc size={13} className={isPlaying ? 'disc-spin' : ''} />
              </div>
            </div>

            <div className="widget-track-info">
              <h3 className="widget-title">{typography(currentTrack.title)}</h3>
              <p className="widget-artist mono">
                {currentTrack.artist} <span className="muted">· {currentTrack.album}</span>
              </p>

              <div className="widget-controls">
                <button
                  type="button"
                  className="widget-ctrl-btn"
                  onClick={handlePrev}
                  aria-label={t('Предыдущий трек', 'Previous track')}
                >
                  <SkipBack size={12} />
                </button>
                <button
                  type="button"
                  className="widget-ctrl-btn widget-ctrl-primary"
                  onClick={togglePlay}
                  aria-label={isPlaying ? t('Пауза', 'Pause') : t('Воспроизвести', 'Play')}
                >
                  {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button
                  type="button"
                  className="widget-ctrl-btn"
                  onClick={handleNext}
                  aria-label={t('Следующий трек', 'Next track')}
                >
                  <SkipForward size={12} />
                </button>
                <button
                  type="button"
                  className="widget-ctrl-btn widget-ctrl-vol"
                  onClick={toggleMute}
                  aria-label={isMuted ? t('Включить звук', 'Unmute') : t('Выключить звук', 'Mute')}
                >
                  {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                </button>
              </div>
            </div>
          </div>

          <div className="widget-progress mono">
            <span className="widget-time">{formatTime(currentTime)}</span>
            <div className="widget-slider-track">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="widget-slider-input"
                aria-label={t('Перемотка', 'Seek')}
              />
              <div
                className="widget-slider-fill"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="widget-time">{formatTime(duration || 166)}</span>
          </div>

          {/* Playlist Drawer */}
          {isPlaylistOpen && (
            <div className="widget-playlist">
              <div className="widget-playlist-header mono">
                <span>{t('ТРЕКИ НА РЕПИТЕ', 'TRACKS ON REPEAT')}</span>
                <span>{defaultTracks.length}</span>
              </div>
              <div className="widget-playlist-items">
                {defaultTracks.map((track, idx) => {
                  const isCurrent = idx === currentIdx;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      className={`widget-playlist-row ${isCurrent ? 'is-active' : ''}`}
                      onClick={() => selectTrack(idx)}
                    >
                      <span className="mono row-num">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="row-thumb">
                        <img src={track.cover} alt="" />
                      </div>
                      <div className="row-info">
                        <span className="row-title">{typography(track.title)}</span>
                        <span className="row-artist mono">{typography(track.artist)}</span>
                      </div>
                      <div className="row-meta mono">
                        {isCurrent && isPlaying ? (
                          <span className="row-playing-tag">{t('PLAY', 'PLAY')}</span>
                        ) : null}
                        <span>{track.duration}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="widget-playlist-footer mono">
                {t('💡 Поместите .mp3 в /public/audio/', '💡 Drop .mp3 files into /public/audio/')}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
