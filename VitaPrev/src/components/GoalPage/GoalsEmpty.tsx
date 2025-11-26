interface GoalsEmptyStateProps {
  onCreateClick: () => void;
}

const GoalsEmptyState = ({ onCreateClick }: GoalsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <span className="text-2xl text-slate-400">📋</span>
      </div>
      <p className="text-sm font-medium text-slate-800">
        Todavía no tienes metas registradas
      </p>
      <p className="mt-1 text-xs text-slate-500 max-w-xs">
        Crea una meta para peso, glucosa o presión arterial y deja que VitaPrev
        actualice el progreso según tus métricas.
      </p>
      <button
        type="button"
        onClick={onCreateClick}
        className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700"
      >
        + Crear primera meta
      </button>
    </div>
  );
};

export default GoalsEmptyState;
