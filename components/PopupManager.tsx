'use client';

import { useState, useEffect, useCallback } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { PopupConfig } from '@/types';
import { X, Info, AlertTriangle, CheckCircle, Gift } from 'lucide-react';

export default function PopupManager() {
  const { config } = useConfig();
  const [activePopup, setActivePopup] = useState<PopupConfig | null>(null);
  const [shownPopups, setShownPopups] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Render solo en cliente
  useEffect(() => setIsClient(true), []);

  // Cargar popups vistos
  useEffect(() => {
    if (!isClient) return;
    try {
      const stored = localStorage.getItem('shownPopups');
      if (stored) setShownPopups(JSON.parse(stored));
    } catch {}
  }, [isClient]);

  // Seleccionar y mostrar popup habilitado
  useEffect(() => {
    if (!isClient || !config?.popups?.length) return;

    const popupToShow = config.popups.find(
      (p) => p.enabled && (!p.showOnce || !shownPopups.includes(p.id))
    );

    if (popupToShow && !activePopup) {
      const t = window.setTimeout(() => setActivePopup(popupToShow), popupToShow.delay ?? 0);
      return () => window.clearTimeout(t);
    }
  }, [config?.popups, shownPopups, activePopup, isClient]);

  const handleClose = useCallback(() => {
    setActivePopup((prev) => {
      if (!prev) return null;
      if (prev.showOnce) {
        const next = Array.from(new Set([...shownPopups, prev.id]));
        setShownPopups(next);
        try {
          localStorage.setItem('shownPopups', JSON.stringify(next));
        } catch {}
      }
      return null;
    });
  }, [shownPopups]);

  const handleAction = useCallback(() => {
    if (activePopup?.buttonAction === 'redirect' && activePopup.redirectUrl) {
      window.open(activePopup.redirectUrl, '_blank');
    }
    handleClose();
  }, [activePopup, handleClose]);

  const getIcon = (type: PopupConfig['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />;
      case 'promotion':
        return <Gift className="h-6 w-6 text-fuchsia-600 dark:text-fuchsia-400" />;
      default:
        return <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getOverlayClasses = (position: PopupConfig['position']) => {
    const base = 'fixed inset-0 z-50 flex px-4 sm:px-6 bg-black/40 dark:bg-black/60';
    const vertical =
      position === 'top'
        ? 'items-start justify-center pt-20'
        : position === 'bottom'
        ? 'items-end justify-center pb-20'
        : 'items-center justify-center';
    return `${base} ${vertical}`;
  };

  // Cerrar con ESC cuando está abierto
  useEffect(() => {
    if (!activePopup) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activePopup, handleClose]);

  if (!isClient || !activePopup) return null;

  const titleId = 'popup-title';
  const descId = 'popup-desc';

  return (
    <div
      className={getOverlayClasses(activePopup.position)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClick={handleClose}
    >
      <div
        className="
          w-full max-w-md md:max-w-lg rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100
          shadow-lg transition-all duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {getIcon(activePopup.type)}
            <h3 id={titleId} className="text-lg font-semibold">
              {activePopup.title}
            </h3>
          </div>

          <button
            onClick={handleClose}
            aria-label="Cerrar"
            className="
              inline-flex h-8 w-8 items-center justify-center rounded-md
              bg-gray-100 text-gray-700 hover:bg-gray-200
              dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-gray-300 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-900
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div id={descId} className="p-4 text-sm leading-relaxed">
          <div
            className="whitespace-pre-wrap"
            // Asegurate de sanear el HTML en backend si proviene de usuarios
            dangerouslySetInnerHTML={{ __html: activePopup.content }}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleClose}
            className="
              rounded-lg px-4 py-2 text-sm font-medium
              bg-gray-100 text-gray-900 hover:bg-gray-200
              dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700
              focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
            "
          >
            Cerrar
          </button>

          <button
            onClick={handleAction}
            className="
              rounded-lg px-4 py-2 text-sm font-semibold
              bg-blue-600 text-white hover:bg-blue-700
              dark:bg-blue-500 dark:hover:bg-blue-600
              focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600
            "
          >
            {activePopup.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
