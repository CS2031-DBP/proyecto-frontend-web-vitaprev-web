import { AnimatePresence, motion } from "framer-motion";

interface MetricsModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  loading: boolean;
  form: {
    weight: string;
    height: string;
    glucoseLevel: string;
    bloodPressure: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const MetricsModal = ({
  isOpen,
  mode,
  loading,
  form,
  onChange,
  onClose,
  onSubmit,
}: MetricsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200"
          >
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">
                {mode === "create"
                  ? "Registrar métricas de hoy"
                  : "Editar métricas"}
              </h3>
              <button
                onClick={onClose}
                className="text-lg text-slate-600 hover:text-slate-800"
              >
                ×
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-5 py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label>Peso (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    min={0}
                    step="0.1"
                    value={form.weight}
                    onChange={onChange}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label>Altura (cm)</label>
                  <input
                    type="number"
                    name="height"
                    min={0}
                    value={form.height}
                    onChange={onChange}
                    required
                    className="rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label>Glucosa (mg/dL)</label>
                  <input
                    type="number"
                    name="glucoseLevel"
                    min={0}
                    value={form.glucoseLevel}
                    onChange={onChange}
                    className="rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label>Presión</label>
                  <input
                    type="text"
                    name="bloodPressure"
                    placeholder="120/80"
                    value={form.bloodPressure}
                    onChange={onChange}
                    className="rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-lg border text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-xs text-white font-medium hover:bg-emerald-700 disabled:opacity-60"
                >
                  {loading
                    ? "Guardando..."
                    : mode === "create"
                    ? "Guardar métricas"
                    : "Actualizar métricas"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MetricsModal;
