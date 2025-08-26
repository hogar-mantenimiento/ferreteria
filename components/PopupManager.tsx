'use client';

import { useState, useEffect } from 'react';
import { useConfig } from '@/hooks/useConfig';
import { PopupConfig } from '@/types';
import { X, Info, AlertTriangle, CheckCircle, Gift } from 'lucide-react';

export default function PopupManager() {
  const { config } = useConfig();
  const [activePopup, setActivePopup] = useState<PopupConfig | null>(null);
  const [shownPopups, setShownPopups] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    // Get shown popups from localStorage
    const stored = localStorage.getItem('shownPopups');
    if (stored) {
      setShownPopups(JSON.parse(stored));
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;
    if (!config.popups || config.popups.length === 0) return;

    // Find the first enabled popup that hasn't been shown (if showOnce is true)
    const popupToShow = config.popups.find(popup => 
      popup.enabled && (!popup.showOnce || !shownPopups.includes(popup.id))
    );

    if (popupToShow && !activePopup) {
      // Show popup after delay
      const timer = setTimeout(() => {
        setActivePopup(popupToShow);
      }, popupToShow.delay);

      return () => clearTimeout(timer);
    }
  }, [config.popups, shownPopups, activePopup, isClient]);

  const handleClose = () => {
    if (activePopup) {
      // Mark as shown if showOnce is true
      if (activePopup.showOnce) {
        const newShownPopups = [...shownPopups, activePopup.id];
        setShownPopups(newShownPopups);
        localStorage.setItem('shownPopups', JSON.stringify(newShownPopups));
      }
      setActivePopup(null);
    }
  };

  const handleAction = () => {
    if (activePopup?.buttonAction === 'redirect' && activePopup.redirectUrl) {
      window.open(activePopup.redirectUrl, '_blank');
    }
    handleClose();
  };

  const getIcon = (type: PopupConfig['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-6 w-6 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'promotion':
        return <Gift className="h-6 w-6 text-white" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getTypeStyles = (_type: PopupConfig['type']) => {
    // Ignoramos el type, siempre blanco/negro
    return 'bg-white text-black border border-gray-300';
  };
  

  const getPositionStyles = (position: PopupConfig['position']) => {
    switch (position) {
      case 'top':
        return 'items-start pt-20';
      case 'bottom':
        return 'items-end pb-20';
      case 'center':
      default:
        return 'items-center';
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient || !activePopup) return null;

  return (
    <div className="popup-overlay items-center animate-fade-in">
    <div className="popup-content border-2 bg-white text-black border-gray-300 animate-fade-in-up">
      <div className="popup-header">
        <div className="flex items-center space-x-3">
          {getIcon(activePopup.type)}
          <h3 className="popup-title">{activePopup.title}</h3>
        </div>
        <button onClick={handleClose} className="popup-close">
          <X className="h-5 w-5" />
        </button>
      </div>
  
      <div className="popup-body">
        <div dangerouslySetInnerHTML={{ __html: activePopup.content }} />
      </div>
  
      <div className="popup-actions">
        <button
          onClick={handleClose}
          className="btn-secondary px-4 py-2 bg-gray-200 text-black"
        >
          Cerrar
        </button>
        <button
          onClick={handleAction}
          className="px-4 py-2 bg-blue-600 text-black dark:text-white hover:bg-gray-500"
        >
          {activePopup.buttonText}
        </button>
      </div>
    </div>
  </div>
  
  );
}