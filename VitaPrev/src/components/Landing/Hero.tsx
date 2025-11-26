function Hero() {
  return (
    <section className="flex justify-center items-start px-6 sm:px-10 min-h-screen pt-24">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <section>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 mb-4">
              🌿 Plataforma de prevención y hábitos saludables
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-emerald-900 leading-tight mb-4">
              Tu salud, organizada <br className="hidden sm:block" /> día a día
              con <span className="text-emerald-600">VitaPrev</span>.
            </h1>

            <p className="text-sm sm:text-base text-emerald-900/80 max-w-md mb-5">
              Registra tus comidas, monitorea métricas como peso, glucosa y
              presión arterial, y recibe recomendaciones inteligentes de{" "}
              <span className="font-semibold">VitaAI</span> para prevenir
              problemas de salud a tiempo.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <p className="text-[11px] text-slate-500">
                VitaPrev no reemplaza el diagnóstico médico. Siempre consulta con un profesional de salud.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[11px] font-medium text-slate-800 hover:border-emerald-300 hover:text-emerald-800 transition-colors"
                onClick={() => {
                  alert("Próximamente en App Store y Google Play 💚");
                }}
              >
                📱 Descargar la app
                <span className="text-[10px] text-slate-500">
                  Próximamente
                </span>
              </button>
            </div>
          </section>

          <section className="relative flex justify-center">
            <div className="absolute w-72 h-72 bg-emerald-200/50 blur-3xl rounded-full -z-10 top-6" />

            <div className="w-full max-w-md">
              <img
                src="/BrandingPanelImg.png"
                alt="Vista previa de VitaPrev"
                className="w-full rounded-4xl shadow-2xl"
              />
            </div>
          </section>
        </div>
      </section>
  )
}

export default Hero