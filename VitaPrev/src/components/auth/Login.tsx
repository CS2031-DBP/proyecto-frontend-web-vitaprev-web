import { useState, type SyntheticEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAuth } from "./useAuth";
import AuthTabs from "./Authtabs";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();

  
  useEffect(() => {
    const saved = localStorage.getItem("vitaprev_remember_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleLogin = (e: SyntheticEvent) => {
    e.preventDefault();

    setError("");

    auth
      .login(email, password)
      .then(() => {
        
        if (remember) {
          localStorage.setItem("vitaprev_remember_email", email);
        } else {
          localStorage.removeItem("vitaprev_remember_email");
        }

        navigate("/dashboard", { replace: true });
      })
      .catch((error: AxiosError) => {
        if (error.response?.status === 401) {
          setError("Usuario o contraseña incorrecta");
          return;
        }
        setError(error.message);
      });
  };

  return (
    <div className="flex justify-center bg-emerald-50 py-10 min-h-screen items-start">

      <div className="w-full max-w-5xl grid grid-cols-1 gap-8 p-4 items-stretch justify-items-center">

        <div className="bg-white rounded-3xl shadow-md p-8 flex flex-col justify-start">

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
            onSubmit={handleLogin}
            className="space-y-4"
            autoComplete="on"
          >

            {/* EMAIL */}
            <div className="space-y-1.5 text-sm">
              <label htmlFor="email" className="block text-slate-600">Correo</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="tucorreo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5 text-sm">
              <label htmlFor="password" className="block text-slate-600">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* RECORDAR */}
            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                className="w-3 h-3 border border-slate-300 rounded-sm checked:bg-emerald-500 checked:border-emerald-500 transition-all"
              />
              <span className="text-slate-500">Recordarme en este dispositivo</span>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="w-full py-2.5 mt-2 bg-emerald-600 rounded-xl text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              Iniciar sesión
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
