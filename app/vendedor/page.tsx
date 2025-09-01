'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  Clock,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ===========================
   Schema & Types
=========================== */

const sellerSchema = z.object({
  // Información Personal
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'Teléfono demasiado largo'),
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
  yearsExperience: z
    .number()
    .optional()
    .or(z.string().transform((v) => (v === '' ? undefined : Number(v)))),
  previousWork: z.string().optional(),
  specialties: z.array(z.string()).min(1, 'Seleccioná al menos una especialidad'),

  // Motivación
  motivation: z.string().min(50, 'Describí tu motivación (mínimo 50 caracteres)'),
});

type SellerFormData = z.infer<typeof sellerSchema>;

/* ===========================
   Helpers UI
=========================== */

function SectionCard(props: { titleIcon?: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop-blur p-6 md:p-8 shadow-sm">
      <div className="flex items-center mb-6">
        {props.titleIcon}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{props.title}</h2>
      </div>
      {props.children}
    </section>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
      {children}
    </label>
  );
}

function Input({
  id,
  type = 'text',
  register,
  autoComplete,
  placeholder,
  ariaInvalid,
  ariaDescribedBy,
}: {
  id: string;
  type?: string;
  register: any;
  autoComplete?: string;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      className="
        w-full rounded-lg border bg-white dark:bg-gray-800
        border-gray-300 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        placeholder-gray-500 dark:placeholder-gray-400
        px-3 py-2 md:px-4 md:py-3
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      {...register}
    />
  );
}

function Textarea({
  id,
  register,
  rows = 6,
  placeholder,
  ariaInvalid,
  ariaDescribedBy,
}: {
  id: string;
  register: any;
  rows?: number;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaDescribedBy?: string;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      className="
        w-full rounded-lg border bg-white dark:bg-gray-800
        border-gray-300 dark:border-gray-700
        text-gray-900 dark:text-gray-100
        placeholder-gray-500 dark:placeholder-gray-400
        px-3 py-2 md:px-4 md:py-3
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      {...register}
    />
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1 text-sm text-red-600">
      {message}
    </p>
  );
}

function Radio({
  name,
  value,
  label,
  register,
}: {
  name: string;
  value: string;
  label: string;
  register: any;
}) {
  const id = `${name}-${value}`;
  return (
    <label htmlFor={id} className="inline-flex items-center gap-2 mr-6 cursor-pointer">
      <input
        id={id}
        type="radio"
        value={value}
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700"
        {...register}
      />
      <span className="text-gray-800 dark:text-gray-200">{label}</span>
    </label>
  );
}

function CheckboxPill({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm
        border transition
        ${checked
          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}
      `}
      aria-pressed={checked}
    >
      {checked && <Check className="h-4 w-4" />}
      {label}
    </button>
  );
}

function Stepper({
  currentStep,
  total = 4,
  labels,
}: {
  currentStep: number;
  total?: number;
  labels: string[];
}) {
  const pct = (currentStep / total) * 100;
  return (
    <div aria-label="Progreso del formulario" role="group" className="mb-8">
      <div className="hidden md:flex items-center justify-between mb-3">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1;
          const active = step <= currentStep;
          return (
            <div
              key={step}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold
                ${active ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}
              `}
              aria-current={step === currentStep ? 'step' : undefined}
              aria-label={labels?.[i] ?? `Paso ${step}`}
              title={labels?.[i] ?? `Paso ${step}`}
            >
              {step}
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2" aria-hidden>
        <div
          className="bg-blue-700 h-2 rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
        {labels[currentStep - 1]}
      </div>
    </div>
  );
}

/* ===========================
   Page
=========================== */

export default function SellerPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stepTopRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
    defaultValues: {
      businessType: 'individual',
      hasExperience: false,
      specialties: [],
    },
    mode: 'onTouched',
  });

  const hasExperience = watch('hasExperience');
  const selectedSpecialties = watch('specialties') || [];

  const specialtyOptions = useMemo(
    () => [
      'Herramientas Manuales',
      'Herramientas Eléctricas',
      'Ferretería General',
      'Pintura y Acabados',
      'Fontanería',
      'Electricidad',
      'Jardinería',
      'Seguridad Industrial',
      'Construcción',
      'Automotriz',
    ],
    []
  );

  const handleSpecialtyChange = (specialty: string) => {
    const current = selectedSpecialties as string[];
    if (current.includes(specialty)) {
      setValue('specialties', current.filter((s) => s !== specialty), { shouldValidate: true });
    } else {
      setValue('specialties', [...current, specialty], { shouldValidate: true });
    }
  };

  const onSubmit = async (data: SellerFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/seller-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast.success('¡Solicitud enviada exitosamente!');
      } else {
        toast.error('Error al enviar la solicitud');
      }
    } catch (e) {
      console.error('Error submitting application:', e);
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    // valida campos del paso actual antes de avanzar
    const fieldsByStep: Record<number, (keyof SellerFormData)[]> = {
      1: ['firstName', 'lastName', 'email', 'phone', 'dni', 'birthDate'],
      2: ['businessName', 'businessType', 'cuit', 'address', 'city', 'province', 'postalCode'],
      3: ['specialties', 'hasExperience'], // years/previous son opcionales
      4: ['motivation'],
    };
    const fields = fieldsByStep[currentStep] ?? [];
    const valid = await trigger(fields as any, { shouldFocus: true });
    if (!valid) return;

    setCurrentStep((p) => Math.min(p + 1, 4));
    stepTopRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
    stepTopRef.current?.focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Ajuste de foco en cambio de paso para accesibilidad
    stepTopRef.current?.focus();
  }, [currentStep]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">¡Solicitud enviada!</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Recibimos tu solicitud para ser vendedor. Te contactaremos en 3–5 días hábiles.
            </p>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-6 shadow-sm max-w-md mx-auto mb-8 text-left">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Próximos pasos</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>✅ Revisión de documentación</li>
                <li>✅ Entrevista telefónica</li>
                <li>✅ Verificación de referencias</li>
                <li>✅ Activación de cuenta</li>
              </ul>
            </div>

            <button
              onClick={() => (window.location.href = '/')}
              className="
                inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold
                bg-gray-900 text-white hover:bg-gray-800
                dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200
                focus:outline-none focus:ring-2 focus:ring-indigo-400
                transition-colors
              "
            >
              Volver al inicio
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      {/* HERO con imagen de fondo + overlay */}
      <section
        className="relative text-white"
        style={{
          backgroundImage: "url('/images/fondo-vendedor.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60" aria-hidden />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">¿Querés ser Vendedor?</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto text-white">
              Unite a nuestro equipo y vendé productos de ferretería como preventista. Capacitación, soporte y
              comisiones competitivas.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-1 text-white">Equipo profesional</h3>
                <p className="opacity-80 text-white">Formá parte de un equipo experimentado</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="text-lg font-semibold mb-1 text-white">Ingresos atractivos</h3>
                <p className="opacity-80 text-white">Comisiones competitivas y bonos</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-3 opacity-90 " />
                <h3 className="text-lg font-semibold mb-1 text-white">Respaldo total</h3>
                <p className="opacity-80 text-white">Capacitación y soporte constante</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Anchor para foco al cambiar de paso */}
        <div tabIndex={-1} ref={stepTopRef} />

        <Stepper
          currentStep={currentStep}
          labels={[
            'Paso 1 de 4 — Información personal',
            'Paso 2 de 4 — Información del negocio',
            'Paso 3 de 4 — Experiencia',
            'Paso 4 de 4 — Motivación',
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          {/* Step 1: Información Personal */}
          {currentStep === 1 && (
            <SectionCard title="Información Personal" titleIcon={<User className="h-6 w-6 text-gray-900 mr-3" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    placeholder="Juan"
                    autoComplete="given-name"
                    ariaInvalid={!!errors.firstName}
                    ariaDescribedBy="err-firstName"
                    register={register('firstName')}
                  />
                  <FieldError id="err-firstName" message={errors.firstName?.message} />
                </div>

                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    placeholder="Pérez"
                    autoComplete="family-name"
                    ariaInvalid={!!errors.lastName}
                    ariaDescribedBy="err-lastName"
                    register={register('lastName')}
                  />
                  <FieldError id="err-lastName" message={errors.lastName?.message} />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@email.com"
                    autoComplete="email"
                    ariaInvalid={!!errors.email}
                    ariaDescribedBy="err-email"
                    register={register('email')}
                  />
                  <FieldError id="err-email" message={errors.email?.message} />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    placeholder="11-1234-5678"
                    autoComplete="tel"
                    ariaInvalid={!!errors.phone}
                    ariaDescribedBy="err-phone"
                    register={register('phone')}
                  />
                  <FieldError id="err-phone" message={errors.phone?.message} />
                </div>

                <div>
                  <Label htmlFor="dni">DNI *</Label>
                  <Input
                    id="dni"
                    placeholder="12345678"
                    autoComplete="off"
                    ariaInvalid={!!errors.dni}
                    ariaDescribedBy="err-dni"
                    register={register('dni')}
                  />
                  <FieldError id="err-dni" message={errors.dni?.message} />
                </div>

                <div>
                  <Label htmlFor="birthDate">Fecha de nacimiento *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    autoComplete="bday"
                    ariaInvalid={!!errors.birthDate}
                    ariaDescribedBy="err-birthDate"
                    register={register('birthDate')}
                  />
                  <FieldError id="err-birthDate" message={errors.birthDate?.message} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Step 2: Información del Negocio */}
          {currentStep === 2 && (
            <SectionCard title="Información del Negocio" titleIcon={<Building className="h-6 w-6 text-indigo-600 mr-3" />}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="businessName">Nombre del negocio *</Label>
                  <Input
                    id="businessName"
                    placeholder="Mi Ferretería"
                    ariaInvalid={!!errors.businessName}
                    ariaDescribedBy="err-businessName"
                    register={register('businessName')}
                  />
                  <FieldError id="err-businessName" message={errors.businessName?.message} />
                </div>

                <div>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Tipo de negocio *
                  </span>
                  <div role="radiogroup" aria-label="Tipo de negocio" className="flex flex-wrap">
                    <Radio name="businessType" value="individual" label="Persona Física" register={register('businessType')} />
                    <Radio name="businessType" value="company" label="Empresa" register={register('businessType')} />
                  </div>
                  <FieldError id="err-businessType" message={errors.businessType?.message as any} />
                </div>

                <div>
                  <Label htmlFor="cuit">CUIT *</Label>
                  <Input
                    id="cuit"
                    placeholder="20123456789"
                    ariaInvalid={!!errors.cuit}
                    ariaDescribedBy="err-cuit"
                    register={register('cuit')}
                  />
                  <FieldError id="err-cuit" message={errors.cuit?.message} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Dirección *</Label>
                    <Input
                      id="address"
                      placeholder="Av. Corrientes 1234"
                      autoComplete="street-address"
                      ariaInvalid={!!errors.address}
                      ariaDescribedBy="err-address"
                      register={register('address')}
                    />
                    <FieldError id="err-address" message={errors.address?.message} />
                  </div>

                  <div>
                    <Label htmlFor="city">Ciudad *</Label>
                    <Input
                      id="city"
                      placeholder="Buenos Aires"
                      autoComplete="address-level2"
                      ariaInvalid={!!errors.city}
                      ariaDescribedBy="err-city"
                      register={register('city')}
                    />
                    <FieldError id="err-city" message={errors.city?.message} />
                  </div>

                  <div>
                    <Label htmlFor="province">Provincia *</Label>
                    <Input
                      id="province"
                      placeholder="CABA"
                      autoComplete="address-level1"
                      ariaInvalid={!!errors.province}
                      ariaDescribedBy="err-province"
                      register={register('province')}
                    />
                    <FieldError id="err-province" message={errors.province?.message} />
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Código Postal *</Label>
                    <Input
                      id="postalCode"
                      placeholder="1000"
                      autoComplete="postal-code"
                      ariaInvalid={!!errors.postalCode}
                      ariaDescribedBy="err-postalCode"
                      register={register('postalCode')}
                    />
                    <FieldError id="err-postalCode" message={errors.postalCode?.message} />
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Step 3: Experiencia */}
          {currentStep === 3 && (
            <SectionCard title="Experiencia" titleIcon={<Star className="h-6 w-6 text-indigo-600 mr-3" />}>
              <div className="space-y-6">
                <label className="inline-flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 rounded"
                    {...register('hasExperience')}
                  />
                  <span className="text-gray-800 dark:text-gray-200">Tengo experiencia previa en ventas</span>
                </label>

                {hasExperience && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="yearsExperience">Años de experiencia</Label>
                      <Input
                        id="yearsExperience"
                        type="number"
                        placeholder="5"
                        ariaInvalid={!!errors.yearsExperience}
                        ariaDescribedBy="err-yearsExperience"
                        register={register('yearsExperience', { valueAsNumber: true, min: 0 })}
                      />
                      <FieldError id="err-yearsExperience" message={errors.yearsExperience?.message as any} />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="previousWork">Trabajo anterior</Label>
                      <Textarea
                        id="previousWork"
                        rows={3}
                        placeholder="Contanos brevemente tu experiencia…"
                        ariaInvalid={!!errors.previousWork}
                        ariaDescribedBy="err-previousWork"
                        register={register('previousWork')}
                      />
                      <FieldError id="err-previousWork" message={errors.previousWork?.message as any} />
                    </div>
                  </div>
                )}

                <div>
                  <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Especialidades * (elegí al menos una)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((label) => (
                      <CheckboxPill
                        key={label}
                        checked={selectedSpecialties.includes(label)}
                        onChange={() => handleSpecialtyChange(label)}
                        label={label}
                      />
                    ))}
                  </div>
                  <FieldError id="err-specialties" message={errors.specialties?.message as any} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Step 4: Motivación */}
          {currentStep === 4 && (
            <SectionCard title="Motivación" titleIcon={<MessageSquare className="h-6 w-6 text-indigo-600 mr-3" />}>
              <div>
                <Label htmlFor="motivation">¿Por qué querés ser vendedor en nuestra empresa? *</Label>
                <Textarea
                  id="motivation"
                  rows={6}
                  placeholder="Contanos tu motivación, objetivos y por qué serías un buen vendedor para el equipo…"
                  ariaInvalid={!!errors.motivation}
                  ariaDescribedBy="err-motivation"
                  register={register('motivation')}
                />
                <FieldError id="err-motivation" message={errors.motivation?.message} />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Mínimo 50 caracteres.</p>

                <div className="mt-8 p-6 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Beneficios de ser vendedor</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>✅ Comisiones competitivas del 8–15%</li>
                    <li>✅ Bonos por objetivos mensuales</li>
                    <li>✅ Capacitación continua</li>
                    <li>✅ Soporte técnico especializado</li>
                    <li>✅ Catálogo completo de productos</li>
                    <li>✅ Flexibilidad horaria</li>
                  </ul>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="
                inline-flex items-center justify-center rounded-lg px-5 py-3 font-medium
                border border-gray-300 dark:border-gray-700
                bg-white text-gray-900 hover:bg-gray-100
                dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800
                disabled:opacity-50 disabled:cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600
                transition-colors
              "
            >
              Anterior
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="
                  inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold
                  bg-gray-900 text-white hover:bg-gray-800
                  dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  transition-colors
                "
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold
                  bg-indigo-600 text-white hover:bg-indigo-500
                  focus:outline-none focus:ring-2 focus:ring-indigo-400
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                {isSubmitting ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  'Enviar solicitud'
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
