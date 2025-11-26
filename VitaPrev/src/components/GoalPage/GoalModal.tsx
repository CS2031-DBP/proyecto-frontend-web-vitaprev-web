import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { FormEvent } from "react";
import type { GoalDirection, GoalType } from "./GoalTypes";

interface GoalModalProps {
  isOpen: boolean;
  type: GoalType;
  direction: GoalDirection;
  targetValue: string;
  currentValue: string;
  deadlineDate: Date | null;
  formError: string | null;
  submitting: boolean;
  onTypeChange: (value: GoalType) => void;
  onDirectionChange: (value: GoalDirection) => void;
  onTargetChange: (value: string) => void;
  onCurrentChange: (value: string) => void;
  onDeadlineChange: (date: Date | null) => void;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
}

const GoalModal = ({
  isOpen,
  type,
  direction,
  targetValue,
  currentValue,
  deadlineDate,
  formError,
  submitting,
  onTypeChange,
  onDirectionChange,
  onTargetChange,
  onCurrentChange,
  onDeadlineChange,
  onClose,
  onSubmit,
}: GoalModalProps) => {
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
          Crear nueva meta de salud
          <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-emerald-50 text-[11px] text-emerald-700 font-medium">
            Panel médico
          </span>
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          Elige el tipo de meta, el objetivo y la fecha límite. Tus métricas
          actualizadas ajustarán el progreso automáticamente.
        </p>

        {formError && (
          <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Tipo de meta
              </label>
              <select
                value={type}
                onChange={(e) => onTypeChange(e.target.value as GoalType)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50"
              >
                <option value="PESO">Peso corporal</option>
                <option value="GLUCOSA">Glucosa</option>
                <option value="PRESION">Presión arterial</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Dirección
              </label>
              <select
                value={direction}
                onChange={(e) =>
                  onDirectionChange(e.target.value as GoalDirection)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-slate-50"
              >
                <option value="DISMINUCION">Disminuir</option>
                <option value="AUMENTO">Aumentar</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Valor objetivo
              </label>
              <input
                type="number"
                step="0.01"
                value={targetValue}
                onChange={(e) => onTargetChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. 75"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Valor actual (opcional)
              </label>
              <input
                type="number"
                step="0.01"
                value={currentValue}
                onChange={(e) => onCurrentChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. 82"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Fecha límite
            </label>
            <DatePicker
              selected={deadlineDate}
              onChange={(date) => onDeadlineChange(date as Date | null)}
              dateFormat="dd-MM-yyyy"
              minDate={new Date()}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholderText="Selecciona una fecha"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              La fecha no puede estar en el pasado.
            </p>
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
              {submitting ? "Guardando..." : "Guardar meta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
