'use client';
import { typography } from '../lib/typography';
/* oxlint-disable next/no-img-element */
import { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Lock,
  Unlock,
  UploadCloud,
  X,
  Check,
  Loader2,
} from 'lucide-react';
import { Header, Footer } from './portfolio';
import { ProfilePhoto3D } from './profile-photo-3d';
import { useLanguage } from './language';
import { useSound } from './sound-provider';
import {
  archiveItems as defaultArchiveItems,
  archiveCategories as defaultArchiveCategories,
  type ArchiveItem,
  type ArchiveCategoryInfo,
} from '../lib/archive';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import './archive.css';

interface ArchivePageProps {
  initialRevision?: number;
  initialCategories?: ArchiveCategoryInfo[];
  initialItems?: ArchiveItem[];
}

function slugifyTag(text: string): string {
  const cyr: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  };
  const slug = text
    .toLowerCase()
    .split('')
    .map((c) => cyr[c] || c)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `cat-${Date.now()}`;
}

async function optimizeImageForUpload(
  file: File,
  maxDimension = 1600,
  quality = 0.88,
): Promise<{ dataUrl: string; fileName: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const src = reader.result as string;
      if (!src) {
        reject(new Error('Empty file'));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ dataUrl: src, fileName: file.name });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        // Keep PNG transparency or use WebP
        const isPng = file.type === 'image/png';
        const mime = isPng ? 'image/png' : 'image/webp';
        const dataUrl = canvas.toDataURL(mime, isPng ? 0.95 : quality);
        resolve({ dataUrl, fileName: file.name });
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

export default function ArchivePage({
  initialRevision = 0,
  initialCategories = defaultArchiveCategories,
  initialItems = defaultArchiveItems,
}: ArchivePageProps) {
  const { lang, t } = useLanguage();
  const { playClick, playCardPick, playThud } = useSound();

  const [categories, setCategories] =
    useState<ArchiveCategoryInfo[]>(initialCategories);
  const [items, setItems] = useState<ArchiveItem[]>(initialItems);
  const [category, setCategory] = useState<string>('all');

  const [revision, setRevision] = useState(initialRevision);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [editingItem, setEditingItem] = useState<ArchiveItem | null>(null);
  const [notice, setNotice] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Add Item Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [titleRu, setTitleRu] = useState<string>('');
  const [titleEn, setTitleEn] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string>('objects');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [customCatRu, setCustomCatRu] = useState<string>('');
  const [customCatEn, setCustomCatEn] = useState<string>('');
  const [noteRu, setNoteRu] = useState<string>('');
  const [noteEn, setNoteEn] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyData = (data: { items: ArchiveItem[]; categories: ArchiveCategoryInfo[]; revision: number }) => {
    setItems(data.items);
    setCategories(data.categories);
    setRevision(data.revision);
  };

  useEffect(() => {
    localStorage.removeItem('rm_archive_admin_token');
    void fetch('/api/archive/session', { cache: 'no-store' }).then(r => r.json() as Promise<{ isAdmin: boolean }>).then(data => setIsAdmin(data.isAdmin === true)).catch(() => {});
  }, []);

  useEffect(() => {
    if (isAddModalOpen || isSubmitting) return;
    let disposed = false;
    const refresh = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch('/api/archive', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json() as { items: ArchiveItem[]; categories: ArchiveCategoryInfo[]; revision: number };
        if (!disposed) applyData(data);
      } catch { /* Keep the last successfully loaded archive. */ }
    };
    void refresh();
    const interval = window.setInterval(refresh, 10000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      disposed = true;
      clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [isAddModalOpen, isSubmitting]);

  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    setIsLoggingIn(true);
    try {
      const res = await fetch('/api/archive/session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: authPassword }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || t('Не удалось войти', 'Could not sign in'));
      setIsAdmin(true);
      setIsAuthModalOpen(false);
      setAuthPassword('');
      playClick();
    } catch (error) { setAuthError(error instanceof Error ? error.message : t('Не удалось войти', 'Could not sign in')); }
    finally { setIsLoggingIn(false); }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/archive/session', { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setIsAdmin(false);
      playClick();
    } catch { setNotice(t('Не удалось выйти. Попробуйте ещё раз.', 'Could not sign out. Try again.')); }
  };

  const handleFileChange = (incomingFile: File | null) => {
    if (!incomingFile) return;
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(incomingFile.type)) {
      setSubmitError(
        t(
          'Пожалуйста, выберите файл изображения (PNG, JPG, WEBP)',
          'Please select an image file (PNG, JPG, WEBP)',
        ),
      );
      return;
    }
    if (incomingFile.size > 20 * 1024 * 1024) {
      setSubmitError(t('Выберите изображение меньше 20 МБ.', 'Choose an image smaller than 20 MB.'));
      return;
    }
    setFile(incomingFile);
    setSubmitError('');
    playCardPick();

    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl((e.target?.result as string) || '');
    };
    reader.readAsDataURL(incomingFile);
  };

  const resetAddForm = () => {
    setEditingItem(null);
    setFile(null);
    setPreviewUrl('');
    setTitleRu('');
    setTitleEn('');
    setSelectedCatId('objects');
    setIsCustomCategory(false);
    setCustomCatRu('');
    setCustomCatEn('');
    setNoteRu('');
    setNoteEn('');
    setSubmitError('');
    setIsSubmitting(false);
  };

  const handleAddSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setSubmitError('');

    if (!file && !editingItem) {
      setSubmitError(
        t('Загрузите изображение предмета', 'Please upload an image'),
      );
      return;
    }

    const finalTitleRu = titleRu.trim() || titleEn.trim() || 'Новый объект';
    const finalTitleEn = titleEn.trim() || finalTitleRu;

    let targetCatId = selectedCatId;
    let targetCatRu = '';
    let targetCatEn = '';

    if (isCustomCategory) {
      if (!customCatRu.trim() && !customCatEn.trim()) {
        setSubmitError(
          t('Введите название нового тега', 'Please specify new tag name'),
        );
        return;
      }
      targetCatRu = customCatRu.trim() || customCatEn.trim();
      targetCatEn = customCatEn.trim() || targetCatRu;
      targetCatId = slugifyTag(targetCatEn || targetCatRu);
    } else {
      const existing = categories.find((c) => c.id === targetCatId);
      targetCatRu = existing?.ru || targetCatId;
      targetCatEn = existing?.en || targetCatId;
    }

    setIsSubmitting(true);

    try {
      const upload = file ? await optimizeImageForUpload(file) : null;

      const res = await fetch('/api/archive', {
        method: editingItem ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: upload?.dataUrl,
          id: editingItem?.id,
          revision,
          titleRu: finalTitleRu,
          titleEn: finalTitleEn,
          categoryId: targetCatId,
          categoryRu: targetCatRu,
          categoryEn: targetCatEn,
          noteRu: noteRu.trim(),
          noteEn: noteEn.trim() || noteRu.trim(),
        }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(
            t(
              'Неверный пароль доступа. Пожалуйста, войдите снова (кнопка «Редактировать архив»).',
              'Invalid admin password. Please log in again (Edit archive button).',
            ),
          );
        }
        let serverError = '';
        try {
          const errJson = (await res.json()) as { error?: string };
          serverError = errJson.error || '';
        } catch {
          serverError = await res.text().catch(() => '');
        }
        throw new Error(
          serverError || t('Ошибка при сохранении', 'Failed to save item'),
        );
      }

      const data = (await res.json()) as {
        items?: ArchiveItem[];
        categories?: ArchiveCategoryInfo[];
        revision: number;
      };
      setRevision(data.revision);
      if (data.items) {
        setItems(data.items);
      }
      if (data.categories) {
        setCategories(data.categories);
      }

      setNotice(t('Сохранено. Изменения видны всем посетителям.', 'Saved. Changes are visible to everyone.'));
      // Switch to category to view new item
      setCategory(targetCatId);
      playThud(0.6);
      setIsAddModalOpen(false);
      resetAddForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string, itemTitle: string) => {
    const confirmMsg = t(
      `Удалить «${itemTitle}» из архива?`,
      `Delete "${itemTitle}" from archive?`,
    );
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch('/api/archive', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: itemId, revision }),
      });

      if (!res.ok) {
        throw new Error(t('Не удалось удалить', 'Failed to delete'));
      }

      const data = (await res.json()) as {
        items?: ArchiveItem[];
        categories?: ArchiveCategoryInfo[];
        revision: number;
      };
      setRevision(data.revision);
      if (data.items) {
        setItems(data.items);
      }
      if (data.categories) {
        setCategories(data.categories);
      }
      playClick();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed');
    }
  };

  const visibleItems = items.filter(
    (item) => category === 'all' || item.categoryId === category,
  );

  return (
    <div className="site creative-site archive-site">
      <Header active="archive" />
      <main>
        <div className="creative-heading">
          <div>
            <span className="creative-eyebrow">
              PERSONAL COLLECTION / ONGOING
            </span>
            <h1>
              {t('Архив', 'Archive')}
              <sup>{String(items.length).padStart(2, '0')}</sup>
            </h1>
          </div>
        </div>

        <div className="archive-toolbar">
          <div className="archive-toolbar-actions">
            {isAdmin ? (
              <div className="archive-admin-bar">
                <button
                  type="button"
                  className="archive-admin-btn archive-admin-btn-primary"
                  onClick={() => {
                    resetAddForm();
                    setIsAddModalOpen(true);
                  }}
                >
                  <Plus size={12} />
                  <span>{t('Добавить объект', 'Add object')}</span>
                </button>
                <button
                  type="button"
                  className="archive-admin-btn"
                  onClick={handleLogout}
                  title={t('Выйти из режима автора', 'Log out')}
                >
                  <Unlock size={11} />
                  <span>{t('Выйти', 'Exit')}</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="archive-admin-btn"
                onClick={() => {
                  setAuthError('');
                  setIsAuthModalOpen(true);
                }}
                title={t('Редактировать архив', 'Edit archive')}
                aria-label={t('Редактировать архив', 'Edit archive')}
              >
                <Pencil size={12} />
                {t('Редактировать архив', 'Edit archive')}
              </button>
            )}
          </div>
        </div>

        {notice && <p className="archive-save-notice" role="status">{notice}</p>}

        <fieldset
          className="archive-filters"
          aria-label={t('Категории архива', 'Archive categories')}
        >
          {categories.map((filter) => {
            const count =
              filter.id === 'all'
                ? items.length
                : items.filter((item) => item.categoryId === filter.id).length;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={category === filter.id}
                onClick={() => {
                  setCategory(filter.id);
                  playClick();
                }}
              >
                {typography(filter[lang] || filter.ru || filter.id)}
                <span>{count}</span>
              </button>
            );
          })}
        </fieldset>

        <div className="archive-grid">
          {visibleItems.map((item, index) => (
            <div key={item.id} className="archive-tile-wrapper">
              <Dialog>
                <DialogTrigger
                  className="archive-tile"
                  aria-label={`${item.title[lang]} — ${t('открыть изображение', 'open image')}`}
                  onClick={() => playCardPick()}
                >
                  <img
                    src={item.image}
                    alt={item.title[lang]}
                    loading={index < 8 ? 'eager' : 'lazy'}
                  />
                </DialogTrigger>
                <DialogContent className="archive-dialog">
                  <div className="archive-dialog-image">
                    <ProfilePhoto3D src={item.image} alt={item.title[lang] || item.title.ru} variant="archive" />
                  </div>
                  <div className="archive-dialog-text">
                    <span className="archive-category">
                      {String(items.indexOf(item) + 1).padStart(2, '0')} /{' '}
                      {typography(item.category[lang] || item.category.ru)}
                    </span>
                    <DialogTitle>{typography(item.title[lang] || item.title.ru)}</DialogTitle>
                    {(item.note?.[lang] || item.note?.ru) && (
                      <DialogDescription>
                        {typography(item.note[lang] || item.note.ru)}
                      </DialogDescription>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {isAdmin && (
                <>
                <button
                  type="button"
                  className="archive-tile-delete archive-tile-edit"
                  aria-label={t('Редактировать карточку', 'Edit card')}
                  title={t('Редактировать карточку', 'Edit card')}
                  onClick={() => {
                    resetAddForm();
                    setEditingItem(item);
                    setTitleRu(item.title.ru);
                    setTitleEn(item.title.en);
                    setNoteRu(item.note?.ru || '');
                    setNoteEn(item.note?.en || '');
                    setSelectedCatId(item.categoryId);
                    setPreviewUrl(item.image);
                    setIsAddModalOpen(true);
                  }}
                ><Pencil size={13} /></button>
                <button
                  type="button"
                  className="archive-tile-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    void handleDeleteItem(
                      item.id,
                      item.title[lang] || item.title.ru,
                    );
                  }}
                  title={t('Удалить предмет', 'Delete item')}
                  aria-label={t('Удалить предмет', 'Delete item')}
                >
                  <Trash2 size={13} />
                </button>
                </>
              )}
            </div>
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="archive-empty">
            <p>
              {t(
                'В этой категории пока ничего нет.',
                'Nothing in this category yet.',
              )}
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('all');
                playClick();
              }}
            >
              {t('Показать весь архив', 'Show the full archive')} ↗
            </button>
          </div>
        )}

        <div className="archive-end">
          <span>↳ {t('Коллекция будет расти.', 'A growing collection.')}</span>
          <output aria-live="polite">
            {String(visibleItems.length).padStart(2, '0')}{' '}
            {t('ФРАГМЕНТОВ', 'FRAGMENTS')}
          </output>
        </div>
      </main>
      <Footer />

      {/* Admin Password Modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={(open) => { if (!isLoggingIn) setIsAuthModalOpen(open); }}>
        <DialogContent className="archive-auth-dialog">
          <div className="archive-form-header">
            <Lock size={18} className="archive-form-icon" />
            <DialogTitle>
              {t('Режим автора архива', 'Archive Author Mode')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'Введите пароль администратора для добавления и управления объектами коллекции.',
                'Enter administrator password to upload and manage collection items.',
              )}
            </DialogDescription>
          </div>
          <form onSubmit={handleLogin} className="archive-form">
            <div className="archive-form-field">
              <label htmlFor="admin-password">
                {t('Пароль', 'Password')}
              </label>
              <input
                autoComplete="current-password"
                required
                id="admin-password"
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                className="archive-input"
              />
            </div>
            {authError && <div className="archive-form-error">{authError}</div>}
            <div className="archive-form-actions">
              <button
                type="button"
                className="archive-btn archive-btn-secondary"
                onClick={() => setIsAuthModalOpen(false)}
              >
                {t('Отмена', 'Cancel')}
              </button>
              <button
                type="submit"
                className="archive-btn archive-btn-primary"
              >
                {isLoggingIn ? t('Вход…', 'Signing in…') : t('Войти', 'Enter')}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => { if (!isSubmitting) setIsAddModalOpen(open); }}>
        <DialogContent className="archive-add-dialog">
          <div className="archive-form-header">
            <DialogTitle>
              {editingItem ? t('Редактировать карточку', 'Edit card') : t('Новый объект в архив', 'Add Object to Archive')}
            </DialogTitle>
            <DialogDescription>
              {t(
                'Загрузите изображение без рамки и укажите тег категории. Новый тег сразу появится в фильтрах.',
                'Upload a frameless object image and set its category tag. New tags immediately register in filters.',
              )}
            </DialogDescription>
          </div>

          <form onSubmit={handleAddSubmit} className="archive-form">
            {/* Image Dropzone */}
            <div className="archive-form-field">
              <label>{t('Изображение предмета', 'Object Image')} *</label>
              <div
                className={`archive-dropzone ${isDragging ? 'dragging' : ''} ${previewUrl ? 'has-preview' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files?.[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {previewUrl ? (
                  <div className="archive-dropzone-preview">
                    <img src={previewUrl} alt="Preview" />
                    <button
                      type="button"
                      className="archive-preview-remove"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl('');
                      }}
                      title={t('Удалить изображение', 'Remove image')}
                    >
                      <X size={14} />
                    </button>
                    <span className="archive-preview-name">{file?.name}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="archive-dropzone-prompt"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={28} />
                    <p>
                      <strong>
                        {t(
                          'Перетащите файл сюда или нажмите для выбора',
                          'Drag & drop image here or click to browse',
                        )}
                      </strong>
                    </p>
                    <small>PNG, JPG, WEBP (лучше с прозрачным фоном)</small>
                  </button>
                )}
              </div>
            </div>

            {/* Category / Tag selection */}
            <div className="archive-form-field">
              <label>{t('Тег / Категория', 'Category / Tag')} *</label>
              <div className="archive-cat-chips">
                {categories
                  .filter((c) => c.id !== 'all')
                  .map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`archive-cat-chip ${!isCustomCategory && selectedCatId === cat.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        setIsCustomCategory(false);
                        playClick();
                      }}
                    >
                      {typography(cat[lang] || cat.ru)}
                    </button>
                  ))}
                <button
                  type="button"
                  className={`archive-cat-chip archive-cat-chip-new ${isCustomCategory ? 'selected' : ''}`}
                  onClick={() => {
                    setIsCustomCategory(true);
                    playClick();
                  }}
                >
                  <Plus size={11} />
                  <span>{t('Новый тег', 'New tag')}</span>
                </button>
              </div>

              {isCustomCategory && (
                <div className="archive-new-tag-inputs">
                  <div>
                    <span className="archive-tag-lang-label">RU</span>
                    <input
                      type="text"
                      value={customCatRu}
                      onChange={(e) => setCustomCatRu(e.target.value)}
                      placeholder={t('Напр. Стулья или Постеры', 'e.g. Chairs')}
                      className="archive-input"
                    />
                  </div>
                  <div>
                    <span className="archive-tag-lang-label">EN</span>
                    <input
                      type="text"
                      value={customCatEn}
                      onChange={(e) => setCustomCatEn(e.target.value)}
                      placeholder={t('e.g. Chairs or Posters', 'e.g. Chairs')}
                      className="archive-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Titles */}
            <div className="archive-form-grid">
              <div className="archive-form-field">
                <label>
                  {t('Название (RU)', 'Title (RU)')} *
                </label>
                <input
                  type="text"
                  value={titleRu}
                  onChange={(e) => setTitleRu(e.target.value)}
                  placeholder={t('Напр. Молочник Alessi', 'e.g. Alessi Jug')}
                  className="archive-input"
                />
              </div>
              <div className="archive-form-field">
                <label>
                  {t('Название (EN)', 'Title (EN)')}
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Alessi Milk Jug"
                  className="archive-input"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="archive-form-grid">
              <div className="archive-form-field">
                <label>
                  {t('Заметка (RU)', 'Note (RU)')}
                </label>
                <textarea
                  rows={2}
                  value={noteRu}
                  onChange={(e) => setNoteRu(e.target.value)}
                  placeholder={t(
                    'Почему этот объект в коллекции, деталь или мысль...',
                    'Why this item is in the collection...',
                  )}
                  className="archive-input archive-textarea"
                />
              </div>
              <div className="archive-form-field">
                <label>
                  {t('Заметка (EN)', 'Note (EN)')}
                </label>
                <textarea
                  rows={2}
                  value={noteEn}
                  onChange={(e) => setNoteEn(e.target.value)}
                  placeholder="Why this item is in the collection..."
                  className="archive-input archive-textarea"
                />
              </div>
            </div>

            {submitError && (
              <div className="archive-form-error">{submitError}</div>
            )}

            <div className="archive-form-actions">
              <button
                type="button"
                className="archive-btn archive-btn-secondary"
                disabled={isSubmitting}
                onClick={() => setIsAddModalOpen(false)}
              >
                {t('Отмена', 'Cancel')}
              </button>
              <button
                type="submit"
                className="archive-btn archive-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    <span>{t('Сохранение...', 'Saving...')}</span>
                  </>
                ) : (
                  <>
                    <Check size={13} />
                    <span>{t('Сохранить для всех', 'Save for everyone')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
