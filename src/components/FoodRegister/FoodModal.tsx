import type { FormEvent } from "react";
import type { FoodType } from "./FoodTypes";

interface FoodRecordModalProps {
  isOpen: boolean;
  submitting: boolean;
  formError: string | null;
  nameFood: string;
  foodType: FoodType;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  onChangeNameFood: (value: string) => void;
  onChangeFoodType: (value: FoodType) => void;
  onChangeDescription: (value: string) => void;
  onChangeCalories: (value: string) => void;
  onChangeProtein: (value: string) => void;
  onChangeCarbs: (value: string) => void;
  onChangeFats: (value: string) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

const FoodRecordModal = ({
  isOpen,
  submitting,
  formError,
  nameFood,
  foodType,
  description,
  calories,
  protein,
  carbs,
  fats,
  onChangeNameFood,
  onChangeFoodType,
  onChangeDescription,
  onChangeCalories,
  onChangeProtein,
  onChangeCarbs,
  onChangeFats,
  onClose,
  onSubmit,
}: FoodRecordModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-lg"
        >
          ×
        </button>

        <h2 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
          Registrar comida
          <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-emerald-50 text-[11px] text-emerald-700 font-medium">
            Análisis nutricional
          </span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Indica el alimento, el tipo de comida y, si lo deseas, los nutrientes.
          Si los dejas en blanco, VitaAI los estimará.
        </p>

        {formError && (
          <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Nombre del alimento / plato
            </label>
            <input
              value={nameFood}
              onChange={(e) => onChangeNameFood(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Ej. Arroz con pollo, Ensalada de frutas..."
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo de comida
              </label>
              <select
                value={foodType}
                onChange={(e) =>
                  onChangeFoodType(e.target.value as FoodType)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50"
              >
                <option value="DESAYUNO">Desayuno</option>
                <option value="ALMUERZO">Almuerzo</option>
                <option value="CENA">Cena</option>
                <option value="SNACK">Snack</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => onChangeDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Ej. Porción mediana con ensalada, sin mayonesa..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Calorías (kcal)
              </label>
              <input
                type="number"
                step="1"
                value={calories}
                onChange={(e) => onChangeCalories(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. 450"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Proteínas (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={protein}
                onChange={(e) => onChangeProtein(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. 25"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Carbohidratos (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={carbs}
                onChange={(e) => onChangeCarbs(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. 60"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Grasas (g)
              </label>
              <input
                type="number"
                step="0.1"
                value={fats}
                onChange={(e) => onChangeFats(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. 15"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Guardando..." : "Registrar comida"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FoodRecordModal;
