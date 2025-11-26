interface Props {
  ultimaMetrica: any;
  pesoActual: number | null;
  imcActual: number | null;
  imcEstado: { label: string; color: string };
  formatDate: (raw: string) => string;
  timeAgo: (raw: string) => string;
}

export default function MetricsSummaryCards({
  ultimaMetrica,
  pesoActual,
  imcActual,
  imcEstado,
  formatDate,
  timeAgo,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {/* PESO */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">
              Peso actual
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {pesoActual != null ? pesoActual.toFixed(1) : "—"}
              <span className="text-base font-normal"> kg</span>
            </p>
          </div>
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 text-[11px] px-2 py-1">
            {pesoActual ? "Estable" : "—"}
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Último registro:{" "}
          {ultimaMetrica ? formatDate(ultimaMetrica.recordDate) : "—"}
        </p>
      </div>

      {/* IMC */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">IMC</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {imcActual != null ? imcActual.toFixed(1) : "—"}
            </p>
          </div>
          <span
            className={`inline-flex items-center justify-center rounded-full text-[11px] px-2 py-1 ${imcEstado.color}`}
          >
            {imcEstado.label}
          </span>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Rango saludable: 18.5 – 24.9
        </p>
      </div>

      {/* ÚLTIMA ACTUALIZACIÓN */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-4 sm:px-5 sm:py-5 flex flex-col justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase">
          Última actualización
        </p>

        <p className="mt-2 text-xl font-semibold text-slate-900">
          {ultimaMetrica ? timeAgo(ultimaMetrica.recordDate) : "—"}
        </p>

        <p className="mt-3 text-xs text-slate-500">
          Mantén tus métricas al día para mejores recomendaciones de VitaAI.
        </p>
      </div>
    </div>
  );
}
