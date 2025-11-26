import type { FoodRecordResponseDto } from "./FoodTypes";
import { foodTypeBadgeClass, foodTypeLabel } from "./FoodTypes";
import { formatDateForDisplay, formatTimeForDisplay } from "./FoodUtils";

interface FoodRecordListProps {
  records: FoodRecordResponseDto[];
  onDelete: (id: number) => void;
}

const FoodRecordList = ({ records, onDelete }: FoodRecordListProps) => {
  if (records.length === 0) return null;

  return (
    <div className="space-y-3">
      {records.map((rec) => {
        const ftLabel = foodTypeLabel[rec.foodType];
        const ftClass = foodTypeBadgeClass[rec.foodType];
        const showAlertBadge = !rec.aptoDiabetico || !rec.aptoHipertenso;

        return (
          <article
            key={rec.id}
            className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-5"
          >
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1" />
              <div className="w-px flex-1 bg-slate-200 mt-1" />
            </div>

            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {rec.nameFood}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {formatDateForDisplay(rec.date)} ·{" "}
                      {formatTimeForDisplay(rec.hour)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${ftClass}`}
                    >
                      {ftLabel}
                    </span>

                    {showAlertBadge && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-rose-50 text-[11px] font-medium text-rose-700 border border-rose-200">
                        ⚠️ Revisa esta elección
                      </span>
                    )}
                  </div>
                </div>

                {rec.description && (
                  <p className="mt-1 text-xs text-slate-600">
                    {rec.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
                  {rec.calories != null && (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 border border-slate-100">
                      🔥 {rec.calories.toFixed(0)} kcal
                    </span>
                  )}
                  {rec.protein != null && (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 border border-slate-100">
                      💪 {rec.protein.toFixed(1)} g proteína
                    </span>
                  )}
                  {rec.carbs != null && (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 border border-slate-100">
                      🍞 {rec.carbs.toFixed(1)} g carbos
                    </span>
                  )}
                  {rec.fats != null && (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 border border-slate-100">
                      🧈 {rec.fats.toFixed(1)} g grasas
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end py-1 gap-2">
                <button
                  type="button"
                  onClick={() => onDelete(rec.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-200 bg-rose-50 text-[11px] font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-800 transition-colors"
                >
                  🗑️ <span>Eliminar</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default FoodRecordList;
