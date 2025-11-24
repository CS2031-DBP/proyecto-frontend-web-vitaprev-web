function Publico() {
  return (
    <section className="flex items-center justify-center min-h-screen px-6 bg-emerald-50 py-20">
      <div className="max-w-6xl mx-auto text-center">

        <h2 className="text-4xl font-extrabold text-emerald-900 mb-6">
          ¿Para quién es VitaPrev?
        </h2>

        <p className="text-lg text-slate-700 mb-16 max-w-2xl mx-auto">
          Diseñada para ayudarte a mejorar tus hábitos, monitorear tu salud y prevenir riesgos
          con recomendaciones personalizadas y claridad total.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* CARD 1 */}
          <div className="group bg-white border border-emerald-100 p-10 rounded-3xl shadow-md min-h-[260px] 
                          flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
            <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
              ⚖️
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              Control de peso
            </h3>
            <p className="text-sm text-slate-600 max-w-[220px]">
              Para quienes buscan bajar, mantener o ganar masa muscular de forma saludable.
            </p>
          </div>

          {/* CARD 2 */}
          <div className="group bg-white border border-emerald-100 p-10 rounded-3xl shadow-md min-h-[260px] 
                          flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
            <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
              🩸
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              Personas con diabetes
            </h3>
            <p className="text-sm text-slate-600 max-w-[220px]">
              Ideal para registrar glucosa, detectar variaciones y recibir alertas inteligentes.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="group bg-white border border-emerald-100 p-10 rounded-3xl shadow-md min-h-[260px] 
                          flex flex-col items-center transition-all duration-300 hover:shadow-lg hover:scale-[1.03]">
            <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110">
              ❤️
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-3">
              Salud cardiovascular
            </h3>
            <p className="text-sm text-slate-600 max-w-[220px]">
              Seguimiento de presión arterial y hábitos que ayudan a proteger tu corazón.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Publico;
