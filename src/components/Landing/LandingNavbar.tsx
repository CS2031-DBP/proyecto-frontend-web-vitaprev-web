import { Link } from "react-router-dom";
import SolutionButton from "./Solutions";
import FunctionsButton from "./Functions";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-30 bg-transparent backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-3 items-center">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0 hover:opacity-80 transition">
        
            <span className="text-3xl font-bold text-emerald-700">
              VitaPrev
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10 text-sm">
            <SolutionButton />
            <FunctionsButton />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth/signin"
              className="hidden sm:inline-flex rounded-lg px-4 py-2.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors"
            >
              Iniciar sesión
            </Link>

            <Link
              to="/auth/signup"
              className="inline-flex rounded-lg px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
