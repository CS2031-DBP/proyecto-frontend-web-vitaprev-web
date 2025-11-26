export default function SolutionButton() {
  return (
    <div className="relative group">
      <button className="text-[15px] font-medium text-slate-700 hover:text-emerald-600 transition">
        Soluciones
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
              <div className="bg-emerald-100 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                📉
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">Bajar de peso</p>
                <p className="text-xs text-slate-600">
                  Reduce grasa con una guía clara.
                </p>
              </div>
            </div>

            {/* ITEM 2 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-100 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                ⚖️
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">Mantener peso</p>
                <p className="text-xs text-slate-600">
                  Control estable de tus hábitos.
                </p>
              </div>
            </div>

            {/* ITEM 3 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-100 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                💪
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">Ganar masa muscular</p>
                <p className="text-xs text-slate-600">
                  Mejora tu nutrición para crecer.
                </p>
              </div>
            </div>

            {/* ITEM 4 */}
            <div className="flex items-start gap-2">
              <div className="bg-emerald-100 p-2 rounded-md text-emerald-700 text-lg shrink-0">
                🩺
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-900">Control Metabólico</p>
                <p className="text-xs text-slate-600">
                  Ideal para glucosa y presión.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
