'use client';
import { useEffect, useState, createContext, useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../lib/sound-fx';
import { useLanguage } from './language';

interface SoundContextType {
  sfxEnabled: boolean;
  toggleSfx: () => void;
  playHover: () => void;
  playClick: () => void;
  playSwitch: () => void;
  playThud: (intensity?: number) => void;
  playDragRustle: (speed?: number) => void;
  playCardPick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  sfxEnabled: true,
  toggleSfx: () => {},
  playHover: () => {},
  playClick: () => {},
  playSwitch: () => {},
  playThud: () => {},
  playDragRustle: () => {},
  playCardPick: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [sfxEnabled, setSfxEnabled] = useState(true);

  useEffect(() => {
    setSfxEnabled(sound.isEnabled());

    // 1. Global listener for hover on interactive elements
    let lastHoverTime = 0;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], [role="tab"]');
      if (interactive) {
        const now = Date.now();
        // Throttle rapid hovers slightly so it sounds like a precise mechanical dial
        if (now - lastHoverTime > 55) {
          sound.playHover();
          lastHoverTime = now;
        }
      }
    };

    // 2. Mechanical click
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest('a, button, [role="button"], [role="tab"]');
      if (clickable) {
        sound.playClick();
      }
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const toggleSfx = () => {
    const next = sound.toggle();
    setSfxEnabled(next);
  };

  return (
    <SoundContext.Provider
      value={{
        sfxEnabled,
        toggleSfx,
        playHover: () => sound.playHover(),
        playClick: () => sound.playClick(),
        playSwitch: () => sound.playSwitch(),
        playThud: (i) => sound.playThud(i),
        playDragRustle: (s) => sound.playDragRustle(s),
        playCardPick: () => sound.playCardPick(),
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}

export function SoundToggle() {
  const { sfxEnabled, toggleSfx } = useSound();
  const { t } = useLanguage();

  return (
    <button
      type="button"
      className={`sound-toggle mono ${sfxEnabled ? 'is-enabled' : 'is-muted'}`}
      onClick={toggleSfx}
      title={sfxEnabled ? t('Выключить звук интерфейса', 'Mute interface sounds') : t('Включить тактильный звук', 'Enable tactile sound')}
      aria-label="Sound effects toggle"
      aria-pressed={sfxEnabled}
    >
      {sfxEnabled ? <Volume2 size={11} /> : <VolumeX size={11} />}
      <span>SFX {sfxEnabled ? 'ON' : 'OFF'}</span>
    </button>
  );
}
