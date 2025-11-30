export default function FunctionsButton() {
  return (
    <div className="relative group">
      <button className="text-[15px] font-medium text-slate-700 hover:text-emerald-600 transition">
        Funciones
      </button>

      <div
        className="absolute left-1/2 z-30 mt-4 w-[520px] -translate-x-1/2 
                   opacity-0 group-hover:opacity-100 group-hover:translate-y-1
                   transition-all duration-200 pointer-events-none 
                   group-hover:pointer-events-auto"
      >
        <div className="rounded-xl shadow-lg ring-1 ring-black/5 bg-white p-5">

          {/* GRID 2x2 */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">

            {/* ITEM 1 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-200 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                🍽️
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Registro de comidas
                </p>
                <p className="text-xs text-slate-500 leading-snug">
                  Añade desayunos, almuerzos y snacks en segundos.
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-200 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                📊
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Métricas de salud
                </p>
                <p className="text-xs text-slate-500 leading-snug">
                  Lleva el control de peso, glucosa y presión arterial.
                </p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-200 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                📈
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  Panel de progreso
                </p>
                <p className="text-xs text-slate-500 leading-snug">
                  Visualiza tu avance semana a semana.
                </p>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-200 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                🤖
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">
                  VitaAI Asistente
                </p>
                <p className="text-xs text-slate-500 leading-snug">
                  Chat de recomendaciones personalizadas según tus datos.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
