export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50 px-4">
      <div className="flex items-center justify-center gap-3 sm:gap-5">
        <span className="text-6xl sm:text-7xl font-extrabold text-slate-800">
          4
        </span>

        <img
          src="/donut.png"
          alt="Donut"
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
        />

        <span className="text-6xl sm:text-7xl font-extrabold text-slate-800">
          4
        </span>
      </div>

      <p className="mt-4 text-slate-600 text-sm sm:text-base">
        Uy… parece que te perdiste 🍃
      </p>

      <a
        href="/dashboard"
        className="mt-6 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
      >
        Volver al inicio
      </a>
    </div>
  );
}
