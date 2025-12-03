interface FoodEmptyStateProps {
  onOpenModal: () => void;
}

const FoodEmptyState = ({ onOpenModal }: FoodEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <span className="text-2xl text-slate-400">🍽️</span>
      </div>
      <p className="text-sm font-medium text-slate-800">
        Aún no tienes registros de comida
      </p>
      <p className="mt-1 text-xs text-slate-500 max-w-xs">
        Registra tu desayuno, almuerzo, cena o snacks para que VitaPrev pueda
        analizar mejor tus hábitos.
      </p>
      <button
        type="button"
        onClick={onOpenModal}
        className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700"
      >
        + Registrar primera comida
      </button>
    </div>
  );
};

export default FoodEmptyState;
