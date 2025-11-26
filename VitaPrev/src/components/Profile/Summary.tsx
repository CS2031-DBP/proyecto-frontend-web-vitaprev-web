interface ProfileSummaryProps {
  weightDisplay: string;
  heightDisplay: string;
  glucoseDisplay: string;
  bpDisplay: string;
}

export default function ProfileSummary({
  weightDisplay,
  heightDisplay,
  glucoseDisplay,
  bpDisplay,
}: ProfileSummaryProps) {
  return (
    <section className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col items-center sm:items-start">
        <p className="text-[11px] uppercase tracking-wide text-emerald-700 mb-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Peso actual
        </p>
        <p className="text-lg font-semibold text-emerald-900">
          {weightDisplay}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Último registro
        </p>
      </div>

      <div className="flex flex-col items-center sm:items-start">
        <p className="text-[11px] uppercase tracking-wide text-emerald-700 mb-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Altura
        </p>
        <p className="text-lg font-semibold text-emerald-900">
          {heightDisplay}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">Estatura</p>
      </div>

      <div className="flex flex-col items-center sm:items-start">
        <p className="text-[11px] uppercase tracking-wide text-emerald-700 mb-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Glucosa
        </p>
        <p className="text-lg font-semibold text-emerald-900">
          {glucoseDisplay}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {glucoseDisplay === "-" ? "No registrado" : "mg/dL"}
        </p>
      </div>

      <div className="flex flex-col items-center sm:items-start">
        <p className="text-[11px] uppercase tracking-wide text-emerald-700 mb-1 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Presión arterial
        </p>
        <p className="text-lg font-semibold text-emerald-900">
          {bpDisplay}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {bpDisplay === "-" ? "No registrado" : ""}
        </p>
      </div>
    </section>
  );
}
