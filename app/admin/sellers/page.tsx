'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/AdminLayout';
import { SellerApplication } from '@/types';
import { Eye, CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSellersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<SellerApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<SellerApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
      return;
    }
    
    if (user?.role === 'admin') {
      fetchApplications();
    }
  }, [user, loading, router]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/seller-applications');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error al cargar las solicitudes');
    } finally {
      setIsLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/seller-applications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);
        fetchApplications();
        setSelectedApplication(null);
      } else {
        toast.error('Error al actualizar la solicitud');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Error al actualizar la solicitud');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </span>
        );
      case 'approved':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprobada
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
            <XCircle className="h-3 w-3 mr-1" />
            Rechazada
          </span>
        );
      default:
        return null;
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
            Solicitudes de Vendedores
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Gestiona las solicitudes para ser vendedor
          </p>
        </div>

        {/* Applications Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No hay solicitudes de vendedores aún.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Solicitante
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Negocio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {application.personalInfo.firstName} {application.personalInfo.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {application.personalInfo.email}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {application.personalInfo.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {application.businessInfo.businessName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {application.businessInfo.city}, {application.businessInfo.province}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="text-primary-600 hover:text-primary-900 mr-3"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'approved')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Detalle de Solicitud
                  </h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Información Personal
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Nombre:</span> {selectedApplication.personalInfo.firstName} {selectedApplication.personalInfo.lastName}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedApplication.personalInfo.email}
                      </div>
                      <div>
                        <span className="font-medium">Teléfono:</span> {selectedApplication.personalInfo.phone}
                      </div>
                      <div>
                        <span className="font-medium">DNI:</span> {selectedApplication.personalInfo.dni}
                      </div>
                      <div>
                        <span className="font-medium">Fecha de Nacimiento:</span> {selectedApplication.personalInfo.birthDate}
                      </div>
                    </div>
                  </div>

                  {/* Business Info */}
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Información del Negocio
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Nombre del Negocio:</span> {selectedApplication.businessInfo.businessName}
                      </div>
                      <div>
                        <span className="font-medium">Tipo:</span> {selectedApplication.businessInfo.businessType}
                      </div>
                      <div>
                        <span className="font-medium">CUIT:</span> {selectedApplication.businessInfo.cuit}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Dirección:</span> {selectedApplication.businessInfo.address}, {selectedApplication.businessInfo.city}, {selectedApplication.businessInfo.province} ({selectedApplication.businessInfo.postalCode})
                      </div>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Experiencia
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Experiencia previa:</span> {selectedApplication.experience.hasExperience ? 'Sí' : 'No'}
                      </div>
                      {selectedApplication.experience.hasExperience && (
                        <>
                          <div>
                            <span className="font-medium">Años de experiencia:</span> {selectedApplication.experience.yearsExperience}
                          </div>
                          <div>
                            <span className="font-medium">Trabajo anterior:</span> {selectedApplication.experience.previousWork}
                          </div>
                        </>
                      )}
                      <div>
                        <span className="font-medium">Especialidades:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedApplication.experience.specialties.map((specialty) => (
                            <span key={specialty} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div className="card p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Motivación
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedApplication.motivation}
                    </p>
                  </div>

                  {/* Actions */}
                  {selectedApplication.status === 'pending' && (
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                        className="btn bg-red-600 text-white hover:bg-red-700"
                      >
                        Rechazar
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedApplication.id, 'approved')}
                        className="btn bg-green-600 text-white hover:bg-green-700"
                      >
                        Aprobar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}