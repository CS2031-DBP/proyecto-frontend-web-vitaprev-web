import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  IoMailOutline,
  IoLockClosedOutline,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";

import { useAuth } from "./useAuth";

interface LoginForm {
  email: string;
  password: string;
}

const REMEMBER_KEY = "vitaprev_remember_email";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY);
    if (saved) {
      setValue("email", saved);
      setRemember(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    setError(null);

    // Validación igual que en handleLogin de mobile
    if (!data.email.trim() || !data.password.trim()) {
      setError("Debes ingresar tu correo y contraseña.");
      return;
    }

    try {
      await auth.login(data.email.trim(), data.password);

      if (remember) {
        localStorage.setItem(REMEMBER_KEY, data.email.trim());
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const axiosErr = err as AxiosError<any>;

      const backendMsg =
        typeof axiosErr.response?.data === "string"
          ? axiosErr.response.data
          : axiosErr.response?.data?.message;

      if (axiosErr.response?.status === 404 || axiosErr.response?.status === 401) {
        setError(backendMsg ?? "Usuario o contraseña incorrecta");
      } else if (axiosErr.response?.status === 500) {
        setError(
          backendMsg ??
            "Ocurrió un error en el servidor. Intenta nuevamente en unos minutos."
        );
      } else {
        setError(
          backendMsg ??
            "Ocurrió un error al iniciar sesión. Intenta nuevamente."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#ecfdf5] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[24px] border border-emerald-200 shadow-md px-5 py-6 sm:px-6 sm:py-7">
          {/* Título / subtítulo como en mobile */}
          <h1 className="text-xl sm:text-2xl font-semibold text-emerald-950 mb-1">
            Bienvenido de nuevo 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Ingresa tus datos para ingresar a tu panel de salud.
          </p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2 text-[11px] sm:text-xs text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
            autoComplete="on"
          >
            {/* EMAIL */}
            <div className="flex items-center gap-3 bg-[#f9fafb] border border-emerald-100 rounded-2xl px-4 py-3">
              <IoMailOutline className="text-emerald-600 text-lg" />
              <div className="flex-1">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^\S+@\S+$/,
                      message: "Correo inválido",
                    },
                  })}
                />
              </div>
            </div>
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-0.5">
                {errors.email.message}
              </p>
            )}

            {/* PASSWORD */}
            <div className="flex items-center gap-3 bg-[#f9fafb] border border-emerald-100 rounded-2xl px-4 py-3">
              <IoLockClosedOutline className="text-emerald-600 text-lg" />
              <div className="flex-1 flex items-center gap-2">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((prev) => !prev)}
                  className="text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {showPw ? (
                    <IoEyeOffOutline className="text-lg" />
                  ) : (
                    <IoEyeOutline className="text-lg" />
                  )}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-0.5">
                {errors.password.message}
              </p>
            )}

            {/* RECORDAR */}
            <div className="flex items-center gap-2 mt-1 text-[11px] sm:text-xs">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember((v) => !v)}
                className="w-3.5 h-3.5 rounded border border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-500">
                Recordarme en este dispositivo
              </span>
            </div>

            {/* BOTÓN LOGIN */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-3 py-2.5 rounded-full bg-emerald-500 text-emerald-950 text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-4 text-[11px] sm:text-xs text-slate-500 text-center">
            ¿No tienes cuenta?{" "}
            <Link
              to="/auth/signup"
              className="text-emerald-600 font-medium hover:underline"
            >
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
