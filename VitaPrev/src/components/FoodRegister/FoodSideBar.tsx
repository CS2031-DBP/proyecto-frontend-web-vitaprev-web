interface FoodSidebarProps {
  filteredCount: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  onOpenModal: () => void;
}

const FoodSidebar = ({
  filteredCount,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFats,
  onOpenModal,
}: FoodSidebarProps) => {
  return (
    <aside className="flex flex-col w-80 bg-white border-r border-slate-100 p-6 gap-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <span className="text-emerald-600 text-lg">🍽️</span>
          </span>
          Registro de comidas
        </h1>
        <p className="text-xs text-slate-500">
          Lleva el control de tus comidas y nutrientes diarios.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
              Registros visibles
            </p>
            <p className="text-xs text-slate-400">Según el filtro actual</p>
          </div>
          <span className="text-2xl font-semibold text-slate-900">
            {filteredCount}
          </span>
        </div>

        <div className="h-px w-full bg-slate-100" />

        <div className="space-y-1">
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">
            Resumen nutricional
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-lg bg-white border border-slate-100 px-2 py-1.5">
              <p className="text-slate-400">Calorías</p>
              <p className="font-semibold text-slate-800">
                {totalCalories.toFixed(0)} kcal
              </p>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 px-2 py-1.5">
              <p className="text-slate-400">Proteínas</p>
              <p className="font-semibold text-slate-800">
                {totalProtein.toFixed(1)} g
              </p>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 px-2 py-1.5">
              <p className="text-slate-400">Carbohidratos</p>
              <p className="font-semibold text-slate-800">
                {totalCarbs.toFixed(1)} g
              </p>
            </div>
            <div className="rounded-lg bg-white border border-slate-100 px-2 py-1.5">
              <p className="text-slate-400">Grasas</p>
              <p className="font-semibold text-slate-800">
                {totalFats.toFixed(1)} g
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-auto pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onOpenModal}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          + Registrar comida
        </button>
        <p className="mt-1 text-[11px] text-slate-400">
          Puedes dejar los nutrientes vacíos y VitaAI los estimará.
        </p>
      </div>
    </aside>
  );
};

export default FoodSidebar;
