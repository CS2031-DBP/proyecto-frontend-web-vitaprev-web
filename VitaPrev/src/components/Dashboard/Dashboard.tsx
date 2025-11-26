import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import { useAxiosForApi } from "../hooks/useAxiosForApi";

import MetricsSummaryCards from "../MetricasSalud/MetricsSummaryCards";
import GoalsSidebar from "../GoalPage/GoalSideBar";
import FoodSidebar from "../FoodRegister/FoodSideBar";

type GoalStatus = "IN_PROGRESS" | "COMPLETED" | "FAILED";
type GoalDirection = "AUMENTO" | "DISMINUCION";
type GoalType = "PESO" | "GLUCOSA" | "PRESION";

interface GoalResponseDto {
  id: number;
  currentValue: number | null;
  targetValue: number;
  progress: number;
  deadline: string;
  status: GoalStatus;
  direction?: GoalDirection;
  type?: GoalType;
}

type FoodType = "DESAYUNO" | "ALMUERZO" | "CENA" | "SNACK";

interface FoodRecordResponseDto {
  id: number;
  nameFood: string;
  date: string; // yyyy-MM-dd
  hour: string; // HH:mm:ss
  foodType: FoodType;
  description: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fats: number | null;
  aptoDiabetico: boolean;
  aptoHipertenso: boolean;
}

interface MetricasSaludResponseDto {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  glucoseLevel: number | null;
  bloodPressure: string | null;
  recordDate: string; // yyyy-MM-dd
}

interface AdviceResponseDto {
  id: number;
  mensaje: string;
  createdAt: string; // yyyy-MM-ddTHH:mm:ss
  riesgo?: string;
}

// === helpers ===
const foodTypeLabel: Record<FoodType, string> = {
  DESAYUNO: "Desayuno",
  ALMUERZO: "Almuerzo",
  CENA: "Cena",
  SNACK: "Snack",
};

const foodTypeChipClass: Record<FoodType, string> = {
  DESAYUNO: "bg-amber-50 text-amber-700",
  ALMUERZO: "bg-emerald-50 text-emerald-700",
  CENA: "bg-indigo-50 text-indigo-700",
  SNACK: "bg-sky-50 text-sky-700",
};

function formatDateForDisplay(isoDate: string) {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function formatTimeForDisplay(time: string) {
  return time?.slice(0, 5) ?? time;
}

function todayIso(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// timeAgo para MetricsSummaryCards
function timeAgoFromIsoDate(raw: string): string {
  if (!raw) return "—";
  const parts = raw.split("-");
  if (parts.length !== 3) return "—";

  const [y, m, d] = parts.map(Number);
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return "—";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Hoy";
  if (diffDays === 1) return "Hace 1 día";
  if (diffDays < 7) return `Hace ${diffDays} días`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks === 1) return "Hace 1 semana";
  if (diffWeeks < 5) return `Hace ${diffWeeks} semanas`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths <= 1) return "Hace 1 mes";
  return `Hace ${diffMonths} meses`;
}

// Estado visual del IMC para MetricsSummaryCards
function getImcEstado(bmi: number | null): { label: string; color: string } {
  if (bmi == null || Number.isNaN(bmi)) {
    return {
      label: "Sin datos",
      color: "bg-slate-100 text-slate-500 border border-slate-200",
    };
  }

  if (bmi < 18.5) {
    return {
      label: "Bajo peso",
      color: "bg-amber-50 text-amber-700 border border-amber-100",
    };
  }

  if (bmi < 25) {
    return {
      label: "Saludable",
      color: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    };
  }

  if (bmi < 30) {
    return {
      label: "Sobrepeso",
      color: "bg-amber-50 text-amber-700 border border-amber-100",
    };
  }

  return {
    label: "Obesidad",
    color: "bg-rose-50 text-rose-700 border border-rose-100",
  };
}

const DashboardPage = () => {
  const [axiosApi] = useAxiosForApi();
  const navigate = useNavigate();

  const [goals, setGoals] = useState<GoalResponseDto[]>([]);
  const [mealsToday, setMealsToday] = useState<FoodRecordResponseDto[]>([]);
  const [latestMetrics, setLatestMetrics] =
    useState<MetricasSaludResponseDto | null>(null);
  const [latestAdvice, setLatestAdvice] =
    useState<AdviceResponseDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === Cargas en paralelo ===
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = todayIso();

        const [metasRes, mealsRes, metricsRes, adviceRes] = await Promise.all([
          axiosApi
            .get<GoalResponseDto[]>("/metas")
            .catch((e: AxiosError) => {
              if (e.response?.status === 404) {
                return { data: [] as GoalResponseDto[] } as any;
              }
              throw e;
            }),
          axiosApi
            .get<FoodRecordResponseDto[]>(
              `/registro-comida/fecha/${today}`
            )
            .catch((e: AxiosError) => {
              if (e.response?.status === 404) {
                return { data: [] as FoodRecordResponseDto[] } as any;
              }
              throw e;
            }),

          // ⬇️ AQUÍ EL CAMBIO: usamos /metricas (lista) en lugar de /metricas-salud/ultima
          axiosApi
            .get<MetricasSaludResponseDto[]>("/metricas")
            .catch((e: AxiosError) => {
              if (e.response?.status === 404) {
                return { data: [] as MetricasSaludResponseDto[] } as any;
              }
              throw e;
            }),

          axiosApi
            .get<AdviceResponseDto>("/consejos/ultimo")
            .catch((e: AxiosError) => {
              if (e.response?.status === 404) {
                return { data: null } as any;
              }
              throw e;
            }),
        ]);

        setGoals(metasRes.data ?? []);
        setMealsToday(mealsRes.data ?? []);

        // === calcular última métrica a partir de la lista ===
        const metricsList = (metricsRes.data ?? []) as MetricasSaludResponseDto[];

        if (metricsList.length === 0) {
          setLatestMetrics(null);
        } else {
          const latest = metricsList.reduce((acc, curr) => {
            const [ay, am, ad] = acc.recordDate.split("-").map(Number);
            const [cy, cm, cd] = curr.recordDate.split("-").map(Number);
            const accDate = new Date(ay, am - 1, ad);
            const currDate = new Date(cy, cm - 1, cd);
            return currDate > accDate ? curr : acc;
          }, metricsList[0]);

          setLatestMetrics(latest);
        }

        setLatestAdvice(adviceRes.data ?? null);
      } catch (err) {
        const axiosErr = err as AxiosError<any>;
        setError(
          axiosErr.response?.data?.message ||
            "No se pudo cargar el resumen de tu día."
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Derivados de metas ===
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

  // === Derivados de comidas de hoy ===
  const totalCaloriesToday = useMemo(
    () => mealsToday.reduce((sum, m) => sum + (m.calories ?? 0), 0),
    [mealsToday]
  );

  const totalProteinToday = useMemo(
    () => mealsToday.reduce((sum, m) => sum + (m.protein ?? 0), 0),
    [mealsToday]
  );

  const totalCarbsToday = useMemo(
    () => mealsToday.reduce((sum, m) => sum + (m.carbs ?? 0), 0),
    [mealsToday]
  );

  const totalFatsToday = useMemo(
    () => mealsToday.reduce((sum, m) => sum + (m.fats ?? 0), 0),
    [mealsToday]
  );

  const riskyMealsCount = useMemo(
    () =>
      mealsToday.filter(
        (m) => !m.aptoDiabetico || !m.aptoHipertenso
      ).length,
    [mealsToday]
  );

  // Para MetricsSummaryCards
  const pesoActual = latestMetrics?.weight ?? null;
  const imcActual = latestMetrics?.bmi ?? null;
  const imcEstado = getImcEstado(imcActual);

  // === UI ===
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header del dashboard */}
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Panel diario de salud
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Resumen de tus métricas, metas y alimentación. Todo en un solo lugar.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
            <span className="text-xs text-emerald-700 font-medium">
              Hoy · {formatDateForDisplay(todayIso())}
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
            Cargando tu panel...
          </div>
        ) : (
          <div className="space-y-6">
            {/* Fila 1: resumen de métricas reutilizando MetricsSummaryCards */}
            <section>
              <MetricsSummaryCards
                ultimaMetrica={latestMetrics}
                pesoActual={pesoActual}
                imcActual={imcActual}
                imcEstado={imcEstado}
                formatDate={formatDateForDisplay}
                timeAgo={timeAgoFromIsoDate}
              />
            </section>

            {/* Fila 2: GoalsSidebar + FoodSidebar + Consejo VitaAI */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Resumen metas */}
              <div className="lg:col-span-1">
                <GoalsSidebar
                  activeGoalsCount={activeGoalsCount}
                  completedGoalsCount={completedGoalsCount}
                  failedGoalsCount={failedGoalsCount}
                  onCreateClick={() => navigate("/metas")}
                />
              </div>

              {/* Resumen comidas */}
              <div className="lg:col-span-1">
                <FoodSidebar
                  filteredCount={mealsToday.length}
                  totalCalories={totalCaloriesToday}
                  totalProtein={totalProteinToday}
                  totalCarbs={totalCarbsToday}
                  totalFats={totalFatsToday}
                  onOpenModal={() => navigate("/registro-comidas")}
                />
              </div>

              {/* Consejo VitaAi */}
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 relative overflow-hidden lg:col-span-1">
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-50" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100 mb-3">
                    <span className="text-emerald-600 text-lg">🤖</span>
                    <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                      VitaAi · Consejo personalizado
                    </span>
                  </div>

                  {latestAdvice ? (
                    <>
                      <p className="text-xs text-slate-500 mb-2">
                        Generado a partir de tus métricas más recientes.
                      </p>
                      <p className="text-sm text-slate-800 leading-relaxed">
                        {latestAdvice.mensaje}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          Recibido el{" "}
                          {latestAdvice.createdAt
                            ? latestAdvice.createdAt.slice(0, 10)
                            : "—"}
                        </span>
                        {latestAdvice.riesgo && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                            Nivel: {latestAdvice.riesgo}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-slate-500">
                      Cuando registres nuevas métricas de salud, VitaAi
                      generará aquí un consejo personalizado para ti.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Fila 3: lista detallada de comidas de hoy */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-slate-900">
                  Detalle de comidas de hoy
                </h2>
                <span className="text-[11px] text-slate-400">
                  {mealsToday.length} registro(s)
                </span>
              </div>

              {mealsToday.length === 0 ? (
                <p className="text-xs text-slate-500">
                  Registra tus comidas en la sección{" "}
                  <span className="font-medium text-emerald-700">
                    Registro de comidas
                  </span>{" "}
                  para verlas aquí.
                </p>
              ) : (
                <>
                  <p className="text-[11px] text-slate-500 mb-1">
                    Total estimado:{" "}
                    <span className="font-semibold text-slate-900">
                      {totalCaloriesToday.toFixed(0)} kcal
                    </span>
                  </p>
                  {riskyMealsCount > 0 && (
                    <p className="text-[11px] text-rose-600 mb-1">
                      ⚠️ {riskyMealsCount} comida(s) podrían no ser ideales para tu
                      perfil.
                    </p>
                  )}

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1 mt-2">
                    {mealsToday.map((m) => {
                      const chipClass = foodTypeChipClass[m.foodType];

                      return (
                        <article
                          key={m.id}
                          className="border border-slate-100 rounded-xl px-3 py-2 flex items-start justify-between gap-2 hover:bg-slate-50/60 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold text-slate-800 truncate">
                                {m.nameFood}
                              </span>
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${chipClass}`}
                              >
                                {foodTypeLabel[m.foodType]}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {formatTimeForDisplay(m.hour)}
                            </p>
                            {m.description && (
                              <p className="mt-0.5 text-[11px] text-slate-600 line-clamp-2">
                                {m.description}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col items-end gap-1 text-[11px]">
                            {m.calories != null && (
                              <span className="text-slate-600">
                                {m.calories.toFixed(0)} kcal
                              </span>
                            )}
                            {(m.protein != null ||
                              m.carbs != null ||
                              m.fats != null) && (
                              <span className="text-slate-400">
                                {m.protein != null
                                  ? `${m.protein.toFixed(0)}P `
                                  : ""}
                                {m.carbs != null
                                  ? `${m.carbs.toFixed(0)}C `
                                  : ""}
                                {m.fats != null
                                  ? `${m.fats.toFixed(0)}G`
                                  : ""}
                              </span>
                            )}
                            {(!m.aptoDiabetico || !m.aptoHipertenso) && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                                ⚠️ revisar
                              </span>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
