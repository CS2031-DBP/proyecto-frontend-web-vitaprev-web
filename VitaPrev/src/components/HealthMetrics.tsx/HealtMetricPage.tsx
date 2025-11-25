import { useEffect, useMemo, useState } from "react";
import { useAxiosForApi } from "../hooks/useAxiosForApi";
import { motion, AnimatePresence } from "framer-motion";
import { IconPlus } from "@tabler/icons-react";

// === COMPONENTES RESUMEN ===
import WeightCard from "./WeightCard";
import ImcCard from "./ImcCard";
import LastUpdateCard from "./LastUpdateCard";

// === COMPONENTE HISTORIAL ===
import MetricsHistory from "./MetricsHistory";

interface MetricasSaludResponseDto {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  glucoseLevel: number | null;
  bloodPressure: string | null;
  recordDate: string;
}

interface MetricasSaludRequestDto {
  weight: number;
  height: number;
  glucoseLevel?: number | null;
  bloodPressure?: string | null;
}

type Mode = "create" | "edit";

const HealthMetricsPage = () => {
  const [axiosApi] = useAxiosForApi();

  const [metricas, setMetricas] = useState<MetricasSaludResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>("create");
  const [editingMetric, setEditingMetric] =
    useState<MetricasSaludResponseDto | null>(null);

  // Form
  const [form, setForm] = useState({
    weight: "",
    height: "",
    glucoseLevel: "",
    bloodPressure: "",
  });

  // ============================= helpers =============================
  const formatDate = (raw: unknown) => {
    if (!raw) return "—";
    if (typeof raw === "string") {
      const [y, m, d] = raw.split("T")[0].split("-");
      return `${d}/${m}/${y}`;
    }
    return "—";
  };

  // ============================= API =============================
  const loadMetricas = async () => {
    try {
      setLoading(true);
      const res = await axiosApi.get<MetricasSaludResponseDto[]>("/metricas");
      setMetricas(res.data);
    } catch (err: any) {
      console.error(err);
      if (err?.response?.status === 404) setMetricas([]);
      else setError("No se pudieron cargar tus métricas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetricas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const metricasOrdenadas = useMemo(
    () =>
      [...metricas]
        .sort((a, b) => a.recordDate.localeCompare(b.recordDate))
        .reverse(),
    [metricas]
  );

  const ultimaMetrica = metricasOrdenadas[0];

  // ============================= modal =============================

  const openCreateModal = () => {
    setModalMode("create");
    setEditingMetric(null);
    setForm({ weight: "", height: "", glucoseLevel: "", bloodPressure: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (m: MetricasSaludResponseDto) => {
    setModalMode("edit");
    setEditingMetric(m);
    setForm({
      weight: m.weight.toString(),
      height: m.height.toString(),
      glucoseLevel: m.glucoseLevel?.toString() ?? "",
      bloodPressure: m.bloodPressure ?? "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const buildRequestBody = (): MetricasSaludRequestDto => ({
    weight: Number(form.weight),
    height: Number(form.height),
    glucoseLevel:
      form.glucoseLevel.trim() === ""
        ? undefined
        : Number(form.glucoseLevel),
    bloodPressure:
      form.bloodPressure.trim() === ""
        ? undefined
        : form.bloodPressure.trim(),
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = buildRequestBody();
      if (modalMode === "create") await axiosApi.post("/metricas", body);
      else if (editingMetric)
        await axiosApi.put(`/metricas/${editingMetric.id}`, body);

      await loadMetricas();
      closeModal();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Error al guardar.");
    } finally {
      setLoading(false);
    }
  };

  // ============================= IMC =============================
  const pesoActual = ultimaMetrica?.weight ?? null;
  const imcActual = ultimaMetrica?.bmi ?? null;

  const getImcEstado = () => {
    if (imcActual == null)
      return { label: "—", color: "bg-slate-200 text-slate-700" };
    if (imcActual < 18.5)
      return { label: "Bajo peso", color: "bg-amber-50 text-amber-700" };
    if (imcActual < 25)
      return { label: "Normal", color: "bg-emerald-50 text-emerald-700" };
    if (imcActual < 30)
      return { label: "Sobrepeso", color: "bg-orange-50 text-orange-700" };
    return { label: "Obesidad", color: "bg-rose-50 text-rose-700" };
  };

  const imcEstado = getImcEstado();

  // ======================================================================
  // UI
  // ======================================================================

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-500 mb-1">
            Salud /{" "}
            <span className="text-slate-700 font-medium">Métricas</span>
          </nav>
          <h1 className="text-2xl font-semibold text-slate-900">
            Métricas de salud
          </h1>
          <p className="text-sm text-slate-500">
            Controla tu peso, IMC y mejoras en tu progreso.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="hidden sm:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-sm
                     hover:bg-emerald-700 transition"
        >
          <IconPlus size={18} />
          Registrar métricas
        </button>
      </div>

      {/* BOTÓN MÓVIL */}
      <div className="sm:hidden flex justify-end">
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium shadow-sm hover:bg-emerald-700 transition"
        >
          <IconPlus size={16} />
          Registrar métricas
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* === CARDS RESUMEN ==================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <WeightCard weight={pesoActual} />

        <ImcCard imc={imcActual} estado={imcEstado} />

        <LastUpdateCard
          date={ultimaMetrica ? formatDate(ultimaMetrica.recordDate) : null}
        />
      </div>

      {/* === HISTORIAL SEPARADO ==================================== */}
      <MetricsHistory
        metricasOrdenadas={metricasOrdenadas}
        loading={loading}
        onEdit={openEditModal}
      />

      {/* === MODAL ==================================== */}
      <AnimatePresence>
        {isModalOpen && (
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
                  {modalMode === "create"
                    ? "Registrar métricas de hoy"
                    : "Editar métricas"}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-lg text-slate-600 hover:text-slate-800"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label>Peso (kg)</label>
                    <input
                      type="number"
                      name="weight"
                      min={0}
                      step="0.1"
                      value={form.weight}
                      onChange={handleFormChange}
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
                      onChange={handleFormChange}
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
                      onChange={handleFormChange}
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
                      onChange={handleFormChange}
                      className="rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
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
                      : modalMode === "create"
                      ? "Guardar métricas"
                      : "Actualizar métricas"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthMetricsPage;
