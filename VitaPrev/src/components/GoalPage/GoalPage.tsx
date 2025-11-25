import { useEffect, useMemo, useState, type FormEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { AxiosError } from "axios";
import { useAxiosForApi } from "../hooks/useAxiosForApi";

export type GoalDirection = "AUMENTO" | "DISMINUCION";
export type GoalType = "PESO" | "GLUCOSA" | "PRESION";
export type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";

export interface GoalRequestDto {
  currentValue?: number | null;
  targetValue: number;
  direction: GoalDirection;
  type: GoalType;
  deadline: string;
}

export interface GoalResponseDto {
  id: number;
  currentValue: number | null;
  targetValue: number;
  progress: number;
  deadline: string;
  status: GoalStatus;
}

const GoalsPage = () => {
  const [axiosApi] = useAxiosForApi();
  const [goals, setGoals] = useState<GoalResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<GoalType>("PESO");
  const [direction, setDirection] = useState<GoalDirection>("DISMINUCION");
  const [targetValue, setTargetValue] = useState<string>("");
  const [currentValue, setCurrentValue] = useState<string>("");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const formatDateToBackend = (date: Date): string => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const getStatusConfig = (status: GoalStatus) => {
    switch (status) {
      case "IN_PROGRESS":
        return { label: "En progreso", badgeClass: "bg-sky-50 text-sky-700" };
      case "COMPLETED":
        return {
          label: "Completada",
          badgeClass: "bg-emerald-50 text-emerald-700",
        };
      case "FAILED":
        return { label: "Vencida", badgeClass: "bg-rose-50 text-rose-700" };
      default:
        return { label: status, badgeClass: "bg-slate-100 text-slate-600" };
    }
  };

  const activeGoalsCount = useMemo(
    () => goals.filter((g) => g.status === "IN_PROGRESS").length,
    [goals]
  );
  const completedGoalsCount = useMemo(
    () => goals.filter((g) => g.status === "COMPLETED").length,
    [goals]
  );
  const failedGoalsCount = useMemo(
    () => goals.filter((g) => g.status === "FAILED").length,
    [goals]
  );

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosApi.get<GoalResponseDto[]>("/metas");
      setGoals(res.data);
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      if (axiosErr.response?.status === 404) {
        setGoals([]);
      } else {
        setError(
          axiosErr.response?.data?.message ||
            "Ocurrió un error al obtener tus metas."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!targetValue || isNaN(Number(targetValue))) {
      setFormError("Debes ingresar un valor objetivo válido.");
      return;
    }
    if (!deadlineDate) {
      setFormError("Debes seleccionar una fecha límite.");
      return;
    }

    const payload: GoalRequestDto = {
      targetValue: Number(targetValue),
      direction,
      type,
      deadline: formatDateToBackend(deadlineDate),
    };

    if (currentValue && !isNaN(Number(currentValue))) {
      payload.currentValue = Number(currentValue);
    }

    setSubmitting(true);
    try {
      await axiosApi.post<GoalResponseDto>("/metas", payload);
      setIsModalOpen(false);
      setTargetValue("");
      setCurrentValue("");
      setDeadlineDate(null);
      setFormError(null);
      await fetchGoals();
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const msg =
        axiosErr.response?.data?.message ||
        "No se pudo crear la meta. Revisa los datos ingresados.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("¿Seguro que deseas eliminar esta meta?");
    if (!ok) return;
    try {
      await axiosApi.delete(`/metas/${id}`);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      const axiosErr = err as AxiosError<any>;
      const msg =
        axiosErr.response?.data?.message ||
        "No se pudo eliminar la meta. Inténtalo nuevamente.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar médico */}
      <aside className="hidden lg:flex lg:flex-col lg:w-80 bg-white border-r border-slate-100 p-6 gap-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
              <span className="text-sky-600 text-lg">🩺</span>
            </span>
            Metas de salud
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Define objetivos y monitorea tu progreso con tus métricas
            registradas en VitaPrev.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="bg-sky-50 rounded-xl px-4 py-3 border border-sky-100">
            <p className="text-[11px] font-medium text-sky-700 uppercase tracking-wide text-center whitespace-nowrap">
              Activas
            </p>
            <p className="mt-1 text-xl font-semibold text-sky-900">
              {activeGoalsCount}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
            <p className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide text-center whitespace-nowrap">
              Completadas
            </p>
            <p className="mt-1 text-xl font-semibold text-emerald-900">
              {completedGoalsCount}
            </p>
          </div>
          <div className="bg-rose-50 rounded-xl px-4 py-3 border border-rose-100">
            <p className="text-[11px] font-medium text-rose-700 uppercase tracking-wide text-center whitespace-nowrap">
              Vencidas
            </p>
            <p className="mt-1 text-xl font-semibold text-rose-900">
              {failedGoalsCount}
            </p>
          </div>
        </div>

        <div className="mt-auto">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-medium shadow-sm hover:bg-sky-700 transition-colors"
          >
            + Crear nueva meta
          </button>
          <p className="mt-1 text-[11px] text-slate-400">
            Máximo de 3 metas activas en simultáneo.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between gap-3 mb-6 lg:hidden">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sky-100">
                <span className="text-sky-600 text-lg">🩺</span>
              </span>
              Metas de salud
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Monitorea tus objetivos con base en tus métricas de salud.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-medium shadow-sm hover:bg-sky-700"
          >
            + Nueva meta
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
            Cargando tus metas...
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <span className="text-2xl text-slate-400">📋</span>
            </div>
            <p className="text-sm font-medium text-slate-800">
              Todavía no tienes metas registradas
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-xs">
              Crea una meta para peso, glucosa o presión arterial y deja que
              VitaPrev actualice el progreso según tus métricas.
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium shadow-sm hover:bg-sky-700"
            >
              + Crear primera meta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const statusCfg = getStatusConfig(goal.status);
              const current =
                goal.currentValue !== null && goal.currentValue !== undefined
                  ? goal.currentValue
                  : null;

              return (
                <article
                  key={goal.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex gap-4"
                >
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-sky-500 mt-1" />
                    <div className="w-px flex-1 bg-slate-200 mt-1" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Meta de salud #{goal.id}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Fecha límite: {goal.deadline}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${statusCfg.badgeClass}`}
                        >
                          {statusCfg.label}
                        </span>
                        {goal.status === "IN_PROGRESS" && (
                          <button
                            type="button"
                            onClick={() => handleDelete(goal.id)}
                            className="text-[11px] text-slate-400 hover:text-rose-600"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Progreso</span>
                        <span>{goal.progress?.toFixed(1) ?? 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            goal.status === "FAILED"
                              ? "bg-rose-400"
                              : "bg-sky-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, goal.progress ?? 0)
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {current !== null
                          ? `${current} → ${goal.targetValue} objetivo`
                          : `Objetivo: ${goal.targetValue}`}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* botón flotante mobile */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 inline-flex items-center justify-center rounded-full bg-sky-600 text-white shadow-lg h-12 w-12 text-2xl hover:bg-sky-700 lg:hidden"
        >
          +
        </button>

        {/* modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-5 relative">
              <button
                type="button"
                onClick={() => {
                  if (!submitting) {
                    setIsModalOpen(false);
                    setFormError(null);
                  }
                }}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 text-lg"
              >
                ×
              </button>

              <h2 className="text-base font-semibold text-slate-900 mb-1 flex items-center gap-2">
                Crear nueva meta de salud
                <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-sky-50 text-[11px] text-sky-700 font-medium">
                  Panel médico
                </span>
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Elige el tipo de meta, el objetivo y la fecha límite. Tus
                métricas actualizadas ajustarán el progreso automáticamente.
              </p>

              {formError && (
                <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs text-rose-700">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Tipo de meta
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as GoalType)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50"
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
                        setDirection(e.target.value as GoalDirection)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50"
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
                      onChange={(e) => setTargetValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                      onChange={(e) => setCurrentValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                    onChange={(date) =>
                      setDeadlineDate(date as Date | null)
                    }
                    dateFormat="dd-MM-yyyy"
                    minDate={new Date()}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
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
                    onClick={() => {
                      if (!submitting) {
                        setIsModalOpen(false);
                        setFormError(null);
                      }
                    }}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:bg-slate-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-lg text-xs font-medium bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Guardando..." : "Guardar meta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GoalsPage;
