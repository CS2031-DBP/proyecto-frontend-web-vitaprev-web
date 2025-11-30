interface GoalsSidebarProps {
  activeGoalsCount: number;
  completedGoalsCount: number;
  failedGoalsCount: number;
  onCreateClick: () => void;
}

const GoalsSidebar = ({
  activeGoalsCount,
  completedGoalsCount,
  failedGoalsCount,
  onCreateClick,
}: GoalsSidebarProps) => {
  return (
    <aside className="flex flex-col w-80 bg-white border-r border-slate-100 p-6 gap-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <span className="text-emerald-600 text-lg">🩺</span>
          </span>
          Metas de salud
        </h1>
        <p className="text-xs text-slate-500">
          Panel de tus objetivos clave para peso, glucosa y presión.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-slate-50/60 px-3 py-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs">
              🔵
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-blue-700 uppercase tracking-wide">
                Activas
              </span>
              <span className="text-[11px] text-slate-500">
                Metas en curso
              </span>
            </div>
          </div>
          <span className="text-2xl font-semibold text-blue-900">
            {activeGoalsCount}
          </span>
        </div>

        <div className="h-px w-full bg-slate-100" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs">
              ✅
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                Completadas
              </span>
              <span className="text-[11px] text-slate-500">
                Metas logradas
              </span>
            </div>
          </div>
          <span className="text-2xl font-semibold text-emerald-900">
            {completedGoalsCount}
          </span>
        </div>

        <div className="h-px w-full bg-slate-100" />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-xs">
              ⏰
            </span>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wide">
                Vencidas
              </span>
              <span className="text-[11px] text-slate-500">
                Plazo expirado
              </span>
            </div>
          </div>
          <span className="text-2xl font-semibold text-rose-900">
            {failedGoalsCount}
          </span>
        </div>
      </section>

      <div className="mt-auto pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCreateClick}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          + Crear nueva meta
        </button>
        <p className="mt-1 text-[11px] text-slate-400">
          Máximo de 3 metas activas en simultáneo.
        </p>
      </div>
    </aside>
  );
};

export default GoalsSidebar;
