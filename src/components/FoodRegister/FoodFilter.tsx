import type { FilterType } from "./FoodTypes";

interface FoodFilterBarProps {
  filterType: FilterType;
  onChangeFilterType: (value: FilterType) => void;
}

const FoodFilterBar = ({
  filterType,
  onChangeFilterType,
}: FoodFilterBarProps) => {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">
          Historial de comidas
        </h2>
        <p className="text-xs text-slate-500">
          Filtra por tipo de comida o revisa tus últimos registros.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-slate-500">Filtrar por tipo:</span>
        <select
          value={filterType}
          onChange={(e) => onChangeFilterType(e.target.value as FilterType)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="TODOS">Todos</option>
          <option value="DESAYUNO">Desayuno</option>
          <option value="ALMUERZO">Almuerzo</option>
          <option value="CENA">Cena</option>
          <option value="SNACK">Snack</option>
        </select>
      </div>
    </div>
  );
};

export default FoodFilterBar;
