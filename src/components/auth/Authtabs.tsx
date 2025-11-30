import { Link, useLocation } from "react-router-dom";

export default function AuthTabs() {
  const location = useLocation();

  const isSignin = location.pathname.includes("signin");
  const isSignup = location.pathname.includes("signup");

  return (
    <div className="w-full flex border-b border-slate-200 mb-2">
      <Link
        to="/auth/signin"
        className={`flex-1 text-center pb-2 text-sm font-medium transition-colors duration-200
          ${isSignin ? "text-emerald-700" : "text-slate-400"}
        `}
      >
        Iniciar sesión
        <div
          className={`h-0.5 mt-1 transition-all duration-300 
            ${isSignin ? "bg-emerald-600 w-full" : "bg-transparent w-0"}
          `}
        ></div>
      </Link>

      <Link
        to="/auth/signup"
        className={`flex-1 text-center pb-2 text-sm font-medium transition-colors duration-200
          ${isSignup ? "text-emerald-700" : "text-slate-400"}
        `}
      >
        Crear cuenta
        <div
          className={`h-0.5 mt-1 transition-all duration-300 
            ${isSignup ? "bg-emerald-600 w-full" : "bg-transparent w-0"}
          `}
        ></div>
      </Link>
    </div>
  );
}
