'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig } from '@/types';

interface ConfigContextType {
  config: StoreConfig;
  updateConfig: (newConfig: StoreConfig) => Promise<void>;
  loading: boolean;
}

const defaultConfig: StoreConfig = {
  storeName: 'Aguante Boca',
  logo: '',
  primaryColor: '#204a87',
  secondaryColor: '#c4a000',
  accentColor: '#2e3436',
  popups: [
    {
      id: '1',
      title: '¡Bienvenido a nuestra tienda!',
      content: 'Descubre nuestros productos exclusivos y ofertas especiales.',
      type: 'info',
      enabled: true,
      showOnce: true,
      delay: 3000,
      position: 'center',
      buttonText: 'Entendido',
      buttonAction: 'close'
    }
  ]
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    // Apply CSS variables when config changes
    applyTheme(config);
  }, [config]);

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const data = await response.json();
        setConfig(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: StoreConfig) => {
    setConfig(newConfig);
    applyTheme(newConfig);
  };

  const applyTheme = (config: StoreConfig) => {
    const root = document.documentElement;
    
    // Helper function to generate color shades
    const generateShades = (baseColor: string) => {
      const hex = baseColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      
      return {
        50: `${Math.min(255, r + 80)}, ${Math.min(255, g + 80)}, ${Math.min(255, b + 80)}`,
        100: `${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}`,
        200: `${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}`,
        300: `${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}`,
        400: `${Math.min(255, r + 10)}, ${Math.min(255, g + 10)}, ${Math.min(255, b + 10)}`,
        500: `${r}, ${g}, ${b}`,
        600: `${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)}`,
        700: `${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}`,
        800: `${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)}`,
        900: `${Math.max(0, r - 80)}, ${Math.max(0, g - 80)}, ${Math.max(0, b - 80)}`,
      };
    };

    const primaryShades = generateShades(config.primaryColor);
    const secondaryShades = generateShades(config.secondaryColor);
    const accentShades = generateShades(config.accentColor);

    // Apply primary color shades
    Object.entries(primaryShades).forEach(([shade, value]) => {
      root.style.setProperty(`--color-primary-${shade}`, value);
    });

    // Apply secondary color shades
    Object.entries(secondaryShades).forEach(([shade, value]) => {
      root.style.setProperty(`--color-secondary-${shade}`, value);
    });

    // Apply accent color shades
    Object.entries(accentShades).forEach(([shade, value]) => {
      root.style.setProperty(`--color-accent-${shade}`, value);
    });
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

export { ConfigContext }