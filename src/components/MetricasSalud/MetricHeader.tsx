import CreateMetricButton from "./CreateMetricsButton";

interface MetricsHeaderProps {
  onCreateClick: () => void;
}

const MetricsHeader = ({ onCreateClick }: MetricsHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <nav className="text-xs text-slate-500 mb-1">
          Salud / <span className="text-slate-700 font-medium">Métricas</span>
        </nav>
        <h1 className="text-2xl font-semibold text-slate-900">
          Métricas de salud
        </h1>
        <p className="text-sm text-slate-500">
          Controla tu peso, IMC y mejoras en tu progreso.
        </p>
      </div>

      <CreateMetricButton onClick={onCreateClick} />
    </div>
  );
};

export default MetricsHeader;
