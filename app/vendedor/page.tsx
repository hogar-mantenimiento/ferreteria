'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  User, 
  Building, 
  Star, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight,
  Users,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const sellerSchema = z.object({
  // Información Personal
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'El teléfono debe tener al menos 10 dígitos'),
  dni: z.string().min(7, 'DNI inválido').max(8, 'DNI inválido'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  
  // Información del Negocio
  businessName: z.string().min(2, 'El nombre del negocio es requerido'),
  businessType: z.enum(['individual', 'company']),
  cuit: z.string().min(11, 'CUIT inválido').max(11, 'CUIT inválido'),
  address: z.string().min(5, 'La dirección es requerida'),
  city: z.string().min(2, 'La ciudad es requerida'),
  province: z.string().min(2, 'La provincia es requerida'),
  postalCode: z.string().min(4, 'Código postal inválido'),
  
  // Experiencia
  hasExperience: z.boolean(),
  yearsExperience: z.number().optional(),
  previousWork: z.string().optional(),
  specialties: z.array(z.string()).min(1, 'Selecciona al menos una especialidad'),
  
  // Motivación
  motivation: z.string().min(50, 'Describe tu motivación (mínimo 50 caracteres)')
});

type SellerFormData = z.infer<typeof sellerSchema>;

export default function SellerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      businessType: 'individual',
      hasExperience: false,
      specialties: []
    }
  });

  const hasExperience = watch('hasExperience');
  const selectedSpecialties = watch('specialties') || [];

  const specialtyOptions = [
    'Herramientas Manuales',
    'Herramientas Eléctricas',
    'Ferretería General',
    'Pintura y Acabados',
    'Fontanería',
    'Electricidad',
    'Jardinería',
    'Seguridad Industrial',
    'Construcción',
    'Automotriz'
  ];

  const handleSpecialtyChange = (specialty: string) => {
    const current = selectedSpecialties;
    if (current.includes(specialty)) {
      setValue('specialties', current.filter(s => s !== specialty));
    } else {
      setValue('specialties', [...current, specialty]);
    }
  };

  const onSubmit = async (data: SellerFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/seller-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('¡Solicitud enviada exitosamente!');
      } else {
        toast.error('Error al enviar la solicitud');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-readable mb-4">
              ¡Solicitud Enviada!
            </h1>
            <p className="text-readable-muted mb-8 max-w-2xl mx-auto">
              Hemos recibido tu solicitud para ser vendedor. Nuestro equipo la revisará 
              y te contactaremos en un plazo de 3-5 días hábiles.
            </p>
            <div className="card p-6 max-w-md mx-auto mb-8">
              <h3 className="font-semibold text-readable mb-4">Próximos pasos:</h3>
              <ul className="text-left space-y-2 text-readable-muted">
                <li>✅ Revisión de documentación</li>
                <li>📞 Entrevista telefónica</li>
                <li>📋 Verificación de referencias</li>
                <li>🎉 Activación de cuenta</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-primary"
            >
              Volver al Inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Querés ser Vendedor?
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Únete a nuestro equipo y vende productos de ferretería como preventista
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Equipo Profesional</h3>
                <p className="opacity-80">Forma parte de un equipo experimentado</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Ingresos Atractivos</h3>
                <p className="opacity-80">Comisiones competitivas y bonos</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
                <h3 className="text-lg font-semibold mb-2">Respaldo Total</h3>
                <p className="opacity-80">Capacitación y soporte constante</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step <= currentStep
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Información Personal */}
          {currentStep === 1 && (
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-readable">Información Personal</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Nombre *
                  </label>
                  <input
                    {...register('firstName')}
                    className="input"
                    placeholder="Juan"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Apellido *
                  </label>
                  <input
                    {...register('lastName')}
                    className="input"
                    placeholder="Pérez"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input"
                    placeholder="juan@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Teléfono *
                  </label>
                  <input
                    {...register('phone')}
                    className="input"
                    placeholder="11-1234-5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    DNI *
                  </label>
                  <input
                    {...register('dni')}
                    className="input"
                    placeholder="12345678"
                  />
                  {errors.dni && (
                    <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    {...register('birthDate')}
                    type="date"
                    className="input"
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Información del Negocio */}
          {currentStep === 2 && (
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-readable">Información del Negocio</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Nombre del Negocio *
                  </label>
                  <input
                    {...register('businessName')}
                    className="input"
                    placeholder="Mi Ferretería"
                  />
                  {errors.businessName && (
                    <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    Tipo de Negocio *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        {...register('businessType')}
                        type="radio"
                        value="individual"
                        className="mr-2"
                      />
                      <span className="text-readable">Persona Física</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        {...register('businessType')}
                        type="radio"
                        value="company"
                        className="mr-2"
                      />
                      <span className="text-readable">Empresa</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-readable mb-2">
                    CUIT *
                  </label>
                  <input
                    {...register('cuit')}
                    className="input"
                    placeholder="20-12345678-9"
                  />
                  {errors.cuit && (
                    <p className="mt-1 text-sm text-red-600">{errors.cuit.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-readable mb-2">
                      Dirección *
                    </label>
                    <input
                      {...register('address')}
                      className="input"
                      placeholder="Av. Corrientes 1234"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-readable mb-2">
                      Ciudad *
                    </label>
                    <input
                      {...register('city')}
                      className="input"
                      placeholder="Buenos Aires"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-readable mb-2">
                      Provincia *
                    </label>
                    <input
                      {...register('province')}
                      className="input"
                      placeholder="CABA"
                    />
                    {errors.province && (
                      <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-readable mb-2">
                      Código Postal *
                    </label>
                    <input
                      {...register('postalCode')}
                      className="input"
                      placeholder="1000"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Experiencia */}
          {currentStep === 3 && (
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <Star className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-readable">Experiencia</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center">
                    <input
                      {...register('hasExperience')}
                      type="checkbox"
                      className="mr-3"
                    />
                    <span className="text-readable">Tengo experiencia previa en ventas</span>
                  </label>
                </div>

                {hasExperience && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-readable mb-2">
                        Años de Experiencia
                      </label>
                      <input
                        {...register('yearsExperience', { valueAsNumber: true })}
                        type="number"
                        className="input"
                        placeholder="5"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-readable mb-2">
                        Trabajo Anterior
                      </label>
                      <textarea
                        {...register('previousWork')}
                        className="input"
                        rows={3}
                        placeholder="Describe tu experiencia laboral anterior..."
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-readable mb-4">
                    Especialidades * (selecciona al menos una)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialtyOptions.map((specialty) => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSpecialties.includes(specialty)}
                          onChange={() => handleSpecialtyChange(specialty)}
                          className="mr-2"
                        />
                        <span className="text-sm text-readable">{specialty}</span>
                      </label>
                    ))}
                  </div>
                  {errors.specialties && (
                    <p className="mt-2 text-sm text-red-600">{errors.specialties.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Motivación */}
          {currentStep === 4 && (
            <div className="card p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-primary-600 mr-3" />
                <h2 className="text-2xl font-bold text-readable">Motivación</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-readable mb-2">
                  ¿Por qué querés ser vendedor en nuestra empresa? *
                </label>
                <textarea
                  {...register('motivation')}
                  className="input"
                  rows={6}
                  placeholder="Cuéntanos sobre tu motivación, objetivos y por qué crees que serías un buen vendedor para nuestro equipo..."
                />
                {errors.motivation && (
                  <p className="mt-2 text-sm text-red-600">{errors.motivation.message}</p>
                )}
                <p className="mt-2 text-sm text-readable-muted">
                  Mínimo 50 caracteres
                </p>
              </div>

              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-readable mb-3">
                  Beneficios de ser nuestro vendedor:
                </h3>
                <ul className="space-y-2 text-readable-muted">
                  <li>✅ Comisiones competitivas del 8-15%</li>
                  <li>✅ Bonos por objetivos mensuales</li>
                  <li>✅ Capacitación continua</li>
                  <li>✅ Soporte técnico especializado</li>
                  <li>✅ Catálogo completo de productos</li>
                  <li>✅ Flexibilidad horaria</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              Anterior
            </button>
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Solicitud'
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}