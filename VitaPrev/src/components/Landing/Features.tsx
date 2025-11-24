export default function FeaturesSection() {
  return (
    <section className="w-full bg-white/80 py-16">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">

        {/* ITEM 1 */}
        <div className="group bg-white border border-emerald-100 p-10 rounded-3xl shadow-md min-h-[260px] flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
          <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
            🍽️
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">
            Registra tus comidas fácilmente
          </h3>
          <p className="text-sm text-slate-600 max-w-[220px]">
            Lleva un historial claro de lo que comes cada día.
          </p>
        </div>

        {/* ITEM 2 */}
        <div className="group bg-white border border-emerald-100 p-10 rounded-3xl shadow-md min-h-[260px] flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
          <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
            📊
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">
            Métricas de salud en un solo lugar
          </h3>
          <p className="text-sm text-slate-600 max-w-[220px]">
            Peso, IMC, glucosa, presión arterial y más, todo centralizado.
          </p>
        </div>

        {/* ITEM 3 */}
        <div className="group bg-white border border-emerald-100 p-10 rounded-3xl shadow-md min-h-[260px] flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
          <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
            💡
          </div>
          <h3 className="text-xl font-semibold text-emerald-800 mb-3">
            Consejos personalizados con VitaAI
          </h3>
          <p className="text-sm text-slate-600 max-w-[220px]">
            Recomendaciones inteligentes basadas en tu progreso real.
          </p>
        </div>

      </div>
    </section>
  );
}
