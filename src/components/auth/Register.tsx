import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { IoCallOutline, IoPersonOutline, IoCalendarOutline, IoAccessibilityOutline, IoScaleOutline, IoAlertCircleOutline, IoWaterOutline, IoHeartOutline, IoChevronBack } from "react-icons/io5";

import { useAuth } from "./useAuth";

interface RegisterForm {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  genre: string;
  weight: string;
  height: string;
  allergies: string;
  diabetic: boolean;
  hypertensive: boolean;
  birthDate: Date | null;
  password: string;
  confirmPassword: string;
  lastGlucose: string;
  lastPressure: string;
}

const TOTAL_STEPS = 5;
const hasNumbers = (value: string) => /\d/.test(value);

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      genre: "",
      weight: "",
      height: "",
      allergies: "",
      diabetic: false,
      hypertensive: false,
      birthDate: null,
      password: "",
      confirmPassword: "",
      lastGlucose: "",
      lastPressure: "",
    },
  });

  const diabetic = watch("diabetic");
  const hypertensive = watch("hypertensive");

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const handleBack = () => {
    if (step === 0) {
      navigate("/", { replace: true });
      return;
    }
    setError("");
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: RegisterForm) => {
    setError("");

    if (!data.name.trim() || !data.lastName.trim() || !data.email.trim()) {
      setError("Nombre, apellidos y correo son obligatorios.");
      return;
    }
    if (hasNumbers(data.name) || hasNumbers(data.lastName)) {
      setError("El nombre y apellidos no pueden contener números.");
      return;
    }
    if (!data.birthDate) {
      setError("La fecha de nacimiento es obligatoria.");
      return;
    }
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (data.diabetic && data.lastGlucose.trim() === "") {
      setError("Ingresa tu último registro de glucosa.");
      return;
    }
    if (data.hypertensive && data.lastPressure.trim() === "") {
      setError("Ingresa tu último registro de presión arterial.");
      return;
    }

    try {
      await auth.register(
        data.name,
        data.lastName,
        data.email,
        data.phone,
        data.genre,
        Number(data.weight),
        Number(data.height),
        data.birthDate,
        data.allergies,
        data.diabetic,
        data.hypertensive,
        data.lastGlucose,
        data.lastPressure,
        data.password
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError;
      console.error(
        "Signup error:",
        axiosErr.response?.status,
        axiosErr.response?.data
      );
      setError(
        typeof axiosErr.response?.data === "string"
          ? axiosErr.response.data
          : "Error al registrarse"
      );
    }
  };

  const handleNext = async () => {
    setError("");
    const data = getValues();

    if (step === 0) {
      if (!data.name.trim() || !data.lastName.trim()) {
        setError("Ingresa tu nombre y apellidos para continuar.");
        return;
      }
      if (hasNumbers(data.name) || hasNumbers(data.lastName)) {
        setError("El nombre y apellidos no pueden contener números.");
        return;
      }
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!data.email.trim()) {
        setError("El correo es obligatorio.");
        return;
      }
      if (!data.password || !data.confirmPassword) {
        setError("Debes ingresar y confirmar tu contraseña.");
        return;
      }
      if (data.password !== data.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!data.birthDate) {
        setError("La fecha de nacimiento es obligatoria.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!data.weight.trim() || !data.height.trim()) {
        setError("Ingresa tu peso y altura para continuar.");
        return;
      }
      setStep(4);
      return;
    }

    if (step === 4) {
      await handleSubmit(onSubmit)();
    }
  };

  const cardBase =
    "flex items-center bg-white border border-emerald-100 rounded-2xl px-4 py-3 mb-3 shadow-sm/10";
  const iconCircle =
    "w-9 h-9 flex items-center justify-center rounded-full bg-emerald-50 mr-3";
  const labelText = "text-xs font-medium text-emerald-950 mb-0.5";
  const valueText = "text-sm text-slate-900";

  const renderStepContent = () => {
    if (step === 0) {
      return (
        <>
          <h2 className="text-xl font-semibold text-emerald-950 mb-1">
            Empecemos, ¿Cómo te llamas?
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Esto nos ayuda a personalizar tu experiencia en VitaPrev.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-emerald-950 text-xs mb-1">
                Nombre
              </label>
              <input
                autoComplete="off"
                placeholder="Ej. André"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("name", { required: "El nombre es obligatorio" })}
              />
              {errors.name && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-emerald-950 text-xs mb-1">
                Apellidos
              </label>
              <input
                autoComplete="off"
                placeholder="Ej. Valle Enriquez"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("lastName", {
                  required: "Los apellidos son obligatorios",
                })}
              />
              {errors.lastName && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </>
      );
    }

    if (step === 1) {
      return (
        <>
          <h2 className="text-xl font-semibold text-emerald-950 mb-1">
            Crea tu cuenta VitaPrev
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Usaremos tu correo para que puedas iniciar sesión de forma segura.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-emerald-950 text-xs mb-1">
                Correo
              </label>
              <input
                type="email"
                autoComplete="off"
                placeholder="tucorreo@ejemplo.com"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^\S+@\S+$/,
                    message: "Correo inválido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-emerald-950 text-xs mb-1">
                Contraseña
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              {errors.password && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-emerald-950 text-xs mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </>
      );
    }

    if (step === 2) {
      return (
        <>
          <h2 className="text-xl font-semibold text-emerald-950 mb-1">
            Sobre ti
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Usamos estos datos para adaptar tus metas y recomendaciones.
          </p>

          {/* Teléfono */}
          <div className={cardBase}>
            <div className={iconCircle}>
              <IoCallOutline className="text-emerald-700 text-lg" />
            </div>
            <div className="flex-1">
              <p className={labelText}>Teléfono</p>
              <input
                autoComplete="off"
                placeholder="Opcional"
                className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Género */}
          <div className={cardBase}>
            <div className={iconCircle}>
              <IoPersonOutline className="text-emerald-700 text-lg" />
            </div>
            <div className="flex-1">
              <p className={labelText}>Género</p>
              <select
                autoComplete="off"
                className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                {...register("genre")}
              >
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          {/* Fecha de nacimiento */}
          <div className={cardBase}>
            <div className={iconCircle}>
              <IoCalendarOutline className="text-emerald-700 text-lg" />
            </div>
            <div className="flex-1">
              <p className={labelText}>Fecha de nacimiento</p>
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Seleccionar"
                    maxDate={new Date()}
                    className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                  />
                )}
              />
            </div>
          </div>
          {errors.birthDate && (
            <p className="text-[11px] text-red-600 mt-1">
              La fecha de nacimiento es obligatoria
            </p>
          )}
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <h2 className="text-xl font-semibold text-emerald-950 mb-1">
            Tu cuerpo hoy
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Estos datos ayudan a calcular tu IMC y progreso.
          </p>

          {/* Altura */}
          <div className={cardBase}>
            <div className={iconCircle}>
              <IoAccessibilityOutline className="text-emerald-700 text-lg" />
            </div>
            <div className="flex-1">
              <p className={labelText}>Altura</p>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  min={0}
                  autoComplete="off"
                  placeholder="Seleccionar"
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                  {...register("height", {
                    validate: (value) =>
                      value === "" || Number(value) >= 0 || "Altura inválida",
                  })}
                />
                <span className="text-xs text-slate-500 ml-2">cm</span>
              </div>
            </div>
          </div>
          {errors.height && (
            <p className="text-[11px] text-red-600 mt-1">
              {errors.height.message}
            </p>
          )}

          {/* Peso */}
          <div className={cardBase}>
            <div className={iconCircle}>
              <IoScaleOutline className="text-emerald-700 text-lg" />
            </div>
            <div className="flex-1">
              <p className={labelText}>Peso</p>
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  min={0}
                  max={300}
                  autoComplete="off"
                  placeholder="Seleccionar"
                  className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
                  {...register("weight", {
                    validate: (value) =>
                      value === "" || Number(value) >= 0 || "Peso inválido",
                  })}
                />
                <span className="text-xs text-slate-500 ml-2">kg</span>
              </div>
            </div>
          </div>
          {errors.weight && (
            <p className="text-[11px] text-red-600 mt-1">
              {errors.weight.message}
            </p>
          )}

          {/* Alergias */}
          <div className={`${cardBase} items-start`}>
            <div className={iconCircle}>
              <IoAlertCircleOutline className="text-amber-700 text-lg" />
            </div>
            <div className="flex-1">
              <p className={labelText}>Alergias</p>
              <textarea
                rows={2}
                autoComplete="off"
                placeholder="Ej. maní, mariscos..."
                className="w-full bg-transparent text-sm text-slate-900 focus:outline-none resize-none"
                {...register("allergies")}
              />
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <h2 className="text-xl font-semibold text-emerald-950 mb-1">
          Condiciones de salud
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Esto nos ayuda a adaptar mejor tus recomendaciones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {/* Diabetes */}
          <div
            className={`rounded-2xl border px-4 py-3 bg-white shadow-sm/10 ${
              diabetic ? "border-emerald-400 bg-emerald-50" : "border-emerald-100"
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={iconCircle}>
                <IoWaterOutline
                  className={`text-lg ${
                    diabetic ? "text-teal-700" : "text-sky-500"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className={labelText}>Diabetes</p>
                <p className="text-xs text-slate-600">
                  ¿Tienes diagnóstico de diabetes?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setValue("diabetic", !diabetic)}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                  diabetic
                    ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                    : "border-slate-300 bg-slate-50 text-slate-600"
                }`}
              >
                {diabetic ? "Sí" : "No"}
              </button>
            </div>

            {diabetic && (
              <div className="mt-2">
                <label className="block text-emerald-950 text-xs mb-1">
                  Última medición: Glucosa (mg/dL)
                </label>
                <input
                  type="number"
                  min={0}
                  autoComplete="off"
                  placeholder="Ej. 95"
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  {...register("lastGlucose")}
                />
              </div>
            )}
          </div>

          {/* Hipertensión */}
          <div
            className={`rounded-2xl border px-4 py-3 bg-white shadow-sm/10 ${
              hypertensive
                ? "border-emerald-400 bg-emerald-50"
                : "border-emerald-100"
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={iconCircle}>
                <IoHeartOutline
                  className={`text-lg ${
                    hypertensive ? "text-red-700" : "text-orange-500"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className={labelText}>Hipertensión</p>
                <p className="text-xs text-slate-600">
                  ¿Te han diagnosticado hipertensión?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setValue("hypertensive", !hypertensive)}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-medium ${
                  hypertensive
                    ? "border-emerald-500 bg-emerald-100 text-emerald-800"
                    : "border-slate-300 bg-slate-50 text-slate-600"
                }`}
              >
                {hypertensive ? "Sí" : "No"}
              </button>
            </div>

            {hypertensive && (
              <div className="mt-2">
                <label className="block text-emerald-950 text-xs mb-1">
                  Última medición: Presión (mmHg)
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  placeholder="Ej. 120/80"
                  className="w-full rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  {...register("lastPressure")}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#ecfdf5] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-3xl">
        <div className="bg-white rounded-[24px] shadow-md border border-emerald-100 px-4 py-5 sm:px-6 sm:py-6">
          {/* Header y progreso */}
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 border border-emerald-100 text-emerald-900"
            >
              <IoChevronBack className="text-base" />
            </button>
            <div className="flex-1 h-1.5 rounded-full bg-emerald-100 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mb-4">
            <h1 className="text-lg sm:text-xl font-semibold text-emerald-950">
              Personaliza tu experiencia en VitaPrev 💚
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1">
              Configura tus datos básicos y de salud para recomendaciones personalizadas.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4 text-sm"
            autoComplete="off"
          >
            {renderStepContent()}

            <button
              type="button"
              onClick={handleNext}
              className="w-full mt-2 py-2.5 rounded-full bg-emerald-500 text-emerald-950 text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Creando cuenta..."
                : step === TOTAL_STEPS - 1
                ? "Crear cuenta"
                : "Siguiente"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
