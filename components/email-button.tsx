'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from './language';

const EMAIL = 'ruslanmelkumian80@yandex.ru';

export function EmailButton({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copyEmail() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(EMAIL);
      setStatus('copied');
      timer.current = setTimeout(() => setStatus('idle'), 2200);
    } catch {
      // Keep the address available for manual copying if clipboard access is denied.
      setStatus('error');
    }
  }

  return (
    <button
      type="button"
      className={`email-copy-button ${className}`}
      onClick={copyEmail}
      title={EMAIL}
      aria-label={status === 'copied' ? t('Скопировано!', 'Copied!') : t(`Скопировать email: ${EMAIL}`, `Copy email: ${EMAIL}`)}
    >
      <span aria-live="polite">
        {status === 'copied' ? t('Скопировано!', 'Copied!') : status === 'error' ? EMAIL : 'Email'}
      </span>
      {status === 'copied' ? <Check size={13} /> : <ArrowUpRight size={13} />}
    </button>
  );
}
