// MealTypeQuickActions.tsx

import type { MealType } from "./FoodRecomTypes";
import { MEAL_TYPES } from "./FoodRecomTypes";

interface MealTypeQuickActionsProps {
  lastTipo: MealType | null;
  loading: boolean;
  onSelectTipo: (tipo: MealType) => void;
}

const MealTypeQuickActions = ({
  lastTipo,
  loading,
  onSelectTipo,
}: MealTypeQuickActionsProps) => {
  return (
    <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 rounded-b-2xl">
      <p className="text-[11px] text-slate-500 mb-2">
        Elige un tipo de comida para que VitaAI genere recomendaciones:
      </p>

      <div className="flex flex-wrap gap-2">
        {MEAL_TYPES.map((mt) => {
          const isActive = lastTipo === mt.key;

          return (
            <button
              key={mt.key}
              type="button"
              onClick={() => onSelectTipo(mt.key)}
              disabled={loading}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {mt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MealTypeQuickActions;
