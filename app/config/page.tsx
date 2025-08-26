'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useConfig } from '@/hooks/useConfig';
import AdminLayout from '@/components/AdminLayout';
import { Upload, Palette, Save, Plus, Trash2, Edit, X } from 'lucide-react';
import { PopupConfig } from '@/types';
import toast from 'react-hot-toast';

export default function ConfigPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { config, updateConfig } = useConfig();
  const [storeName, setStoreName] = useState(config.storeName);
  const [primaryColor, setPrimaryColor] = useState(config.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(config.secondaryColor);
  const [accentColor, setAccentColor] = useState(config.accentColor);
  const [logo, setLogo] = useState(config.logo);
  const [isLoading, setIsLoading] = useState(false);
  const [popups, setPopups] = useState<PopupConfig[]>(config.popups || []);
  const [editingPopup, setEditingPopup] = useState<PopupConfig | null>(null);
  const [showPopupForm, setShowPopupForm] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newConfig = {
        storeName,
        primaryColor,
        secondaryColor,
        accentColor,
        logo,
        popups,
      };

      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig),
      });

      if (response.ok) {
        await updateConfig(newConfig);
        toast.success('Configuración guardada exitosamente');
      } else {
        throw new Error('Error saving configuration');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (user.role !== 'admin') {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Configuración de la Tienda
          </h1>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            Personaliza la apariencia y configuración de tu tienda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Store Name */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Información General
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="input"
                placeholder="Mi Ferretería"
                required
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Logo de la Tienda
            </h2>
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-20 w-20 object-contain rounded-lg border"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  Subir Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="input"
                />
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Formatos soportados: JPG, PNG, GIF. Tamaño máximo: 2MB
                </p>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              <Palette className="h-5 w-5 inline mr-2" />
              Esquema de Colores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  Color Primario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="input flex-1"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  Color Secundario
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="input flex-1"
                    placeholder="#64748B"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
                  Color de Acento
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-16 rounded border border-gray-300"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="input flex-1"
                    placeholder="#D946EF"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Vista Previa
            </h2>
            <div className="border rounded-lg p-4">
              <div className="flex items-center mb-4">
                {logo && (
                  <img src={logo} alt="Logo" className="h-8 w-8 mr-3" />
                )}
                <h3 className="text-lg font-semibold">{storeName}</h3>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: primaryColor }}
                >
                  Primario
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: secondaryColor }}
                >
                  Secundario
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  Acento
                </button>
              </div>
            </div>
          </div>

          {/* Popup Management */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Gestión de Popups
              </h2>
              <button
                onClick={() => {
                  setEditingPopup({
                    id: Date.now().toString(),
                    title: '',
                    content: '',
                    type: 'info',
                    enabled: true,
                    showOnce: true,
                    delay: 2000,
                    position: 'center',
                    buttonText: 'Aceptar',
                    buttonAction: 'close'
                  });
                  setShowPopupForm(true);
                }}
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Popup
              </button>
            </div>

            {/* Popup List */}
            <div className="space-y-4 mb-6">
              {popups.map((popup) => (
                <div key={popup.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {popup.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          popup.enabled 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {popup.enabled ? 'Activo' : 'Inactivo'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          popup.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                          popup.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          popup.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        }`}>
                          {popup.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Posición: {popup.position} | Delay: {popup.delay}ms | {popup.showOnce ? 'Una vez' : 'Siempre'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingPopup(popup);
                          setShowPopupForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPopups(popups.filter(p => p.id !== popup.id));
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Popup Form Modal */}
            {showPopupForm && editingPopup && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {editingPopup.title ? 'Editar Popup' : 'Nuevo Popup'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowPopupForm(false);
                        setEditingPopup(null);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={editingPopup.title}
                          onChange={(e) => setEditingPopup({...editingPopup, title: e.target.value})}
                          className="input"
                          placeholder="Título del popup"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Tipo
                        </label>
                        <select
                          value={editingPopup.type}
                          onChange={(e) => setEditingPopup({...editingPopup, type: e.target.value as PopupConfig['type']})}
                          className="input"
                        >
                          <option value="info">Información</option>
                          <option value="warning">Advertencia</option>
                          <option value="success">Éxito</option>
                          <option value="promotion">Promoción</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Contenido (HTML permitido)
                      </label>
                      <textarea
                        value={editingPopup.content}
                        onChange={(e) => setEditingPopup({...editingPopup, content: e.target.value})}
                        rows={4}
                        className="input"
                        placeholder="Contenido del popup (puedes usar HTML)"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Posición
                        </label>
                        <select
                          value={editingPopup.position}
                          onChange={(e) => setEditingPopup({...editingPopup, position: e.target.value as PopupConfig['position']})}
                          className="input"
                        >
                          <option value="center">Centro</option>
                          <option value="top">Arriba</option>
                          <option value="bottom">Abajo</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Delay (ms)
                        </label>
                        <input
                          type="number"
                          value={editingPopup.delay}
                          onChange={(e) => setEditingPopup({...editingPopup, delay: parseInt(e.target.value)})}
                          className="input"
                          min="0"
                          step="500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Texto del Botón
                        </label>
                        <input
                          type="text"
                          value={editingPopup.buttonText}
                          onChange={(e) => setEditingPopup({...editingPopup, buttonText: e.target.value})}
                          className="input"
                          placeholder="Aceptar"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                          Acción del Botón
                        </label>
                        <select
                          value={editingPopup.buttonAction}
                          onChange={(e) => setEditingPopup({...editingPopup, buttonAction: e.target.value as PopupConfig['buttonAction']})}
                          className="input"
                        >
                          <option value="close">Cerrar</option>
                          <option value="redirect">Redirigir</option>
                        </select>
                      </div>

                      {editingPopup.buttonAction === 'redirect' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            URL de Redirección
                          </label>
                          <input
                            type="text"
                            value={editingPopup.redirectUrl || ''}
                            onChange={(e) => setEditingPopup({...editingPopup, redirectUrl: e.target.value})}
                            className="input"
                            placeholder="/ofertas"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingPopup.enabled}
                          onChange={(e) => setEditingPopup({...editingPopup, enabled: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">Activo</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={editingPopup.showOnce}
                          onChange={(e) => setEditingPopup({...editingPopup, showOnce: e.target.checked})}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-200">Mostrar solo una vez</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowPopupForm(false);
                        setEditingPopup(null);
                      }}
                      className="btn btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        if (popups.find(p => p.id === editingPopup.id)) {
                          // Update existing
                          setPopups(popups.map(p => p.id === editingPopup.id ? editingPopup : p));
                        } else {
                          // Add new
                          setPopups([...popups, editingPopup]);
                        }
                        setShowPopupForm(false);
                        setEditingPopup(null);
                      }}
                      className="btn btn-primary"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {isLoading ? 'Guardando...' : 'Guardar Configuración'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}