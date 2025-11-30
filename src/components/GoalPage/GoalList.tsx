import { useEffect, useState } from "react";
import type { GoalResponseDto, GoalStatus } from "./GoalTypes";

interface GoalsListProps {
  goals: GoalResponseDto[];
  onDelete: (id: number) => void;
}

function GoalRadialProgress({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(100, value));
    let frame: number;
    let start: number | null = null;
    const duration = 600;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const current = Math.round(progress * clamped);
      setDisplayValue(current);
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  const radius = 28;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = displayValue / 100;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative h-16 w-16 flex items-center justify-center">
      <svg className="h-16 w-16" viewBox="0 0 80 80" aria-hidden="true">
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#059669"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 40 40)"
        />
      </svg>
      <span className="absolute text-[11px] font-semibold text-slate-800">
        {displayValue}%
      </span>
    </div>
  );
}

const getStatusConfig = (status: GoalStatus) => {
  switch (status) {
    case "IN_PROGRESS":
      return {
        label: "En progreso",
        badgeClass: "bg-emerald-50 text-emerald-700",
      };
    case "COMPLETED":
      return {
        label: "Completada",
        badgeClass: "bg-emerald-100 text-emerald-800",
      };
    case "FAILED":
      return { label: "Vencida", badgeClass: "bg-rose-50 text-rose-700" };
    default:
      return { label: status, badgeClass: "bg-slate-100 text-slate-600" };
  }
};

const GoalsList = ({ goals, onDelete }: GoalsListProps) => {
  if (goals.length === 0) return null;

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const statusCfg = getStatusConfig(goal.status);
        const current =
          goal.currentValue !== null && goal.currentValue !== undefined
            ? goal.currentValue
            : null;
        const rawProgress = goal.progress ?? 0;
        const clampedProgress = Math.min(100, Math.max(0, rawProgress));

        return (
          <article
            key={goal.id}
            className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-5"
          >
            <div className="flex flex-col items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1" />
              <div className="w-px flex-1 bg-slate-200 mt-1" />
            </div>

            <div className="flex items-center gap-5 flex-1">
              <GoalRadialProgress value={clampedProgress} />

              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-1">
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
                        onClick={() => onDelete(goal.id)}
                        className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-rose-200 bg-rose-50 text-[11px] font-medium text-rose-700 hover:bg-rose-100 hover:border-rose-300 hover:text-rose-800 transition-colors"
                      >
                        🗑️ <span>Eliminar</span>
                      </button>
                    )}
                  </div>
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
  );
};

export default GoalsList;
