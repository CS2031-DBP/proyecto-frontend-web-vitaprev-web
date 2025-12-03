import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import AuthTabs from "./Authtabs";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [remember, setRemember] = useState(false);

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
    const saved = localStorage.getItem("vitaprev_remember_email");
    if (saved) {
      setValue("email", saved);
      setRemember(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginForm) => {
    setError("");

    try {
      await auth.login(data.email, data.password);

      if (remember) {
        localStorage.setItem("vitaprev_remember_email", data.email);
      } else {
        localStorage.removeItem("vitaprev_remember_email");
      }

      navigate("/dashboard", { replace: true });
    } catch (err) {
      const error = err as AxiosError<any>;

      const backendMsg =
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message;

      if (error.response?.status === 404 || error.response?.status === 401) {
        setError(backendMsg ?? "Usuario o contraseña incorrecta");
        return;
      }

      if (error.response?.status === 500) {
        setError(
          backendMsg ??
            "Ocurrió un error en el servidor. Intenta nuevamente en unos minutos."
        );
        return;
      }

      setError(
        backendMsg ??
          "Ocurrió un error al iniciar sesión. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 py-10 px-4 sm:px-6 flex items-center">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8 flex flex-col justify-start">
          <AuthTabs />

          <h2 className="text-lg font-semibold text-slate-800 mb-2">
            Bienvenido de nuevo 👋
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Ingresa con tu correo y contraseña para acceder a tu panel de VitaPrev.
          </p>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            autoComplete="on"
          >
            <div className="space-y-1.5 text-sm">
              <label htmlFor="email" className="block text-slate-600">
                Correo
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
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
                <p className="text-xs text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5 text-sm">
              <label htmlFor="password" className="block text-slate-600">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-3 h-3 border border-slate-300 rounded-sm checked:bg-emerald-500 checked:border-emerald-500 transition-all"
              />
              <span className="text-slate-500">
                Recordarme en este dispositivo
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-emerald-600 rounded-xl text-white text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="mt-3 text-[12px] text-slate-500 text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/auth/signup" className="text-emerald-600 hover:underline">
              Crear una cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
