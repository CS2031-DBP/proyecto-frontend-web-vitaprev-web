import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import AuthTabs from "./Authtabs";
import DatePicker from "react-datepicker";
import { useForm, Controller } from "react-hook-form";

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

export default function RegisterPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
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

  const onSubmit = async (data: RegisterForm) => {
    setError("");

    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!data.birthDate) {
      setError("La fecha de nacimiento es obligatoria");
      return;
    }

    if (data.diabetic && data.lastGlucose.trim() === "") {
      setError("Ingresa tu último registro de glucosa");
      return;
    }

    if (data.hypertensive && data.lastPressure.trim() === "") {
      setError("Ingresa tu último registro de presión arterial");
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
      console.error("Signup error:", axiosErr.response?.status, axiosErr.response?.data);
      setError(
        typeof axiosErr.response?.data === "string"
          ? axiosErr.response.data
          : "Error al registrarse"
      );
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4 sm:px-6 flex items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
          <AuthTabs />

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Personaliza tu experiencia en VitaPrev 💚
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configura tus datos básicos y de salud para recomendaciones personalizadas.
            </p>
          </div>

          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 text-sm"
            autoComplete="off"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Nombre</label>
                <input
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("name", { required: "El nombre es obligatorio" })}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Apellidos</label>
                <input
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("lastName", { required: "Los apellidos son obligatorios" })}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Correo</label>
                <input
                  type="email"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="tucorreo@ejemplo.com"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: "Correo inválido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Teléfono</label>
                <input
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 mb-1">Género</label>
                <select
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("genre")}
                >
                  <option value="">Seleccionar</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1">
                  Fecha de nacimiento
                </label>
                <Controller
                  control={control}
                  name="birthDate"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="dd-MM-yyyy"
                      minDate={new Date(1900, 0, 1)}
                      maxDate={new Date()}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                />
                {errors.birthDate && (
                  <p className="text-xs text-red-600 mt-1">
                    La fecha de nacimiento es obligatoria
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  autoComplete="off"
                  min={0}
                  max={300}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("weight", {
                    validate: (value) =>
                      value === "" || Number(value) >= 0 || "Peso inválido",
                  })}
                />
                {errors.weight && (
                  <p className="text-xs text-red-600 mt-1">{errors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  autoComplete="off"
                  min={0}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  {...register("height", {
                    validate: (value) =>
                      value === "" || Number(value) >= 0 || "Altura inválida",
                  })}
                />
                {errors.height && (
                  <p className="text-xs text-red-600 mt-1">{errors.height.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Alergias</label>
              <input
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ej. maní, mariscos..."
                {...register("allergies")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-700 mb-1">¿Diabetes?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      diabetic
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setValue("diabetic", true)}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      !diabetic
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setValue("diabetic", false)}
                  >
                    No
                  </button>
                </div>
                {diabetic && (
                  <div className="mt-2">
                    <label className="block text-slate-700 mb-1">
                      Último registro de glucosa (mg/dL)
                    </label>
                    <input
                      type="number"
                      autoComplete="off"
                      min={0}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                      {...register("lastGlucose")}
                    />
                  </div>
                )}
              </div>

              <div>
                <p className="text-slate-700 mb-1">¿Hipertensión?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      hypertensive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setValue("hypertensive", true)}
                  >
                    Sí
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-full border text-xs ${
                      !hypertensive
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-300 text-slate-600"
                    }`}
                    onClick={() => setValue("hypertensive", false)}
                  >
                    No
                  </button>
                </div>
                {hypertensive && (
                  <div className="mt-2">
                    <label className="block text-slate-700 mb-1">
                      Último registro de presión arterial (mmHg)
                    </label>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Ej. 120/80"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                      {...register("lastPressure")}
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                {...register("confirmPassword", {
                  required: "Confirma tu contraseña",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              className="w-full mt-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-5 text-[12px] text-slate-500 text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/auth/signin"
              className="text-emerald-600 font-medium hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
