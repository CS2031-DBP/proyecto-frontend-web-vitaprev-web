import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import type { AxiosError } from "axios";
import { useAxiosForApi } from "../hooks/useAxiosForApi";

import GoalsSidebar from "./GoalSideBar";
import GoalsEmptyState from "./GoalsEmpty";
import GoalsList from "./GoalList";
import GoalModal from "./GoalModal";

import type {
  GoalDirection,
  GoalType,
  GoalRequestDto,
  GoalResponseDto,
} from "./GoalTypes";

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

    const target = Number(targetValue);
    const current =
      currentValue && !isNaN(Number(currentValue))
        ? Number(currentValue)
        : null;

    if (current !== null) {
      if (direction === "DISMINUCION" && target >= current) {
        setFormError(
          "Para metas de disminución, el valor objetivo debe ser menor al valor actual."
        );
        return;
      }
      if (direction === "AUMENTO" && target <= current) {
        setFormError(
          "Para metas de aumento, el valor objetivo debe ser mayor al valor actual."
        );
        return;
      }
    }

    const payload: GoalRequestDto = {
      targetValue: target,
      direction,
      type,
      deadline: formatDateToBackend(deadlineDate),
    };

    if (current !== null) {
      payload.currentValue = current;
    }

    setSubmitting(true);
    try {
      await axiosApi.post<GoalResponseDto>("/metas", payload);
      resetForm();
      setIsModalOpen(false);
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

  const resetForm = () => {
    setTargetValue("");
    setCurrentValue("");
    setDeadlineDate(null);
    setFormError(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setFormError(null);
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row gap-6">
        <GoalsSidebar
          activeGoalsCount={activeGoalsCount}
          completedGoalsCount={completedGoalsCount}
          failedGoalsCount={failedGoalsCount}
          onCreateClick={handleOpenModal}
        />

        <main className="flex-1 rounded-2xl bg-white border border-slate-100 px-6 py-6">
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
            <GoalsEmptyState onCreateClick={handleOpenModal} />
          ) : (
            <GoalsList goals={goals} onDelete={handleDelete} />
          )}

          <GoalModal
            isOpen={isModalOpen}
            type={type}
            direction={direction}
            targetValue={targetValue}
            currentValue={currentValue}
            deadlineDate={deadlineDate}
            formError={formError}
            submitting={submitting}
            onTypeChange={setType}
            onDirectionChange={setDirection}
            onTargetChange={setTargetValue}
            onCurrentChange={setCurrentValue}
            onDeadlineChange={setDeadlineDate}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
          />
        </main>
      </div>
    </div>
  );
};

export default GoalsPage;
