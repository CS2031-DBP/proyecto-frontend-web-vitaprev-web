import { useMemo, useState } from "react";

interface MetricasSaludResponseDto {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  glucoseLevel: number | null;
  bloodPressure: string | null;
  recordDate: string;
}

interface MetricsHistoryProps {
  metricasOrdenadas: MetricasSaludResponseDto[];
  loading: boolean;
  onEdit: (m: MetricasSaludResponseDto) => void;
}

const MetricsHistory = ({
  metricasOrdenadas,
  loading,
  onEdit,
}: MetricsHistoryProps) => {
  // Filtros locales
  const [filterDate, setFilterDate] = useState("");
  const [filterPesoMin, setFilterPesoMin] = useState("");
  const [filterPesoMax, setFilterPesoMax] = useState("");

  // fecha máxima (hoy)
  const today = new Date();
  const todayInput = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const formatDate = (raw: unknown) => {
    if (!raw) return "—";
    if (typeof raw === "string") {
      const [y, m, d] = raw.split("T")[0].split("-");
      return `${d}/${m}/${y}`;
    }
    return "—";
  };

  const normalizeToInputDate = (raw: unknown) => {
    if (!raw) return null;
    if (typeof raw === "string") return raw.split("T")[0];
    return null;
  };

  const metricasFiltradas = useMemo(() => {
    let result = metricasOrdenadas;

    if (filterDate) {
      result = result.filter(
        (m) => normalizeToInputDate(m.recordDate) === filterDate
      );
    }

    const min = filterPesoMin ? Math.max(0, Number(filterPesoMin)) : 0;
    const max = filterPesoMax ? Math.max(min, Number(filterPesoMax)) : Infinity;

    result = result.filter((m) => m.weight >= min && m.weight <= max);

    return result;
  }, [metricasOrdenadas, filterDate, filterPesoMin, filterPesoMax]);

  const totalRegistros = metricasOrdenadas.length;
  const registrosMostrados = metricasFiltradas.length;

  const resetFilters = () => {
    setFilterDate("");
    setFilterPesoMin("");
    setFilterPesoMax("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
      {/* Header simulando tabs */}
      <div className="border-b border-slate-200 px-4 sm:px-5">
        <nav className="flex space-x-6" aria-label="Tabs">
          <button className="py-3 text-sm font-medium text-slate-400 hover:text-slate-600">
            Resumen
          </button>
          <button className="py-3 text-sm font-medium border-b-2 border-emerald-600 text-emerald-700">
            Historial
          </button>
        </nav>
      </div>

      {/* Contenido historial */}
      <div className="p-4 sm:p-6 space-y-4">
        {/* FILTROS */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {/* Fecha */}
            <div className="flex flex-col gap-1">
              <label
                className="text-xs font-medium text-slate-600"
                htmlFor="filtro-fecha"
              >
                Fecha específica
              </label>
              <input
                id="filtro-fecha"
                type="date"
                value={filterDate}
                max={todayInput}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Peso mínimo */}
            <div className="flex flex-col gap-1">
              <label
                className="text-xs font-medium text-slate-600"
                htmlFor="peso-min"
              >
                Peso mínimo (kg)
              </label>
              <input
                id="peso-min"
                type="number"
                min={0}
                value={filterPesoMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFilterPesoMin(v < 0 ? "0" : e.target.value);
                }}
                placeholder="70"
                className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Peso máximo */}
            <div className="flex flex-col gap-1">
              <label
                className="text-xs font-medium text-slate-600"
                htmlFor="peso-max"
              >
                Peso máximo (kg)
              </label>
              <input
                id="peso-max"
                type="number"
                min={0}
                value={filterPesoMax}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setFilterPesoMax(v < 0 ? "0" : e.target.value);
                }}
                placeholder="80"
                className="text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Botones filtros */}
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              Aplicar filtros
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Info pequeña */}
        <p className="text-[11px] text-slate-400">
          Los filtros se aplican sobre tus registros ya cargados desde{" "}
          <code className="bg-slate-50 px-1 rounded border border-slate-200">
            GET /metricas
          </code>
          .
        </p>

        {/* TABLA HISTORIAL */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Fecha
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Peso (kg)
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Altura (cm)
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  IMC
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Presión (mmHg)
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Glucosa
                </th>
                <th className="text-left font-semibold text-slate-500 px-3 py-2">
                  Notas
                </th>
                <th className="text-right font-semibold text-slate-500 px-3 py-2">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metricasFiltradas.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-3 py-4 text-center text-slate-400"
                  >
                    {loading ? "Cargando..." : "No hay datos."}
                  </td>
                </tr>
              )}

              {metricasFiltradas.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2 text-slate-700">
                    {formatDate(m.recordDate)}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.weight.toFixed(1)}
                  </td>
                  <td className="px-3 py-2 text-slate-700">{m.height}</td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.bmi?.toFixed(1) ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.bloodPressure ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-slate-700">
                    {m.glucoseLevel != null ? `${m.glucoseLevel} mg/dL` : "—"}
                  </td>
                  <td className="px-3 py-2 text-slate-500">—</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => onEdit(m)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 hover:bg-slate-50"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación texto estilo mockup */}
        <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
          <p>
            Mostrando{" "}
            {registrosMostrados === 0 ? 0 : 1}–{registrosMostrados} de{" "}
            {totalRegistros} registros
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              Anterior
            </button>
            <span className="px-2 py-1">Página 1 de 1</span>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsHistory;
