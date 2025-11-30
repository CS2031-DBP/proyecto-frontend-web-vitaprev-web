const FoodRecommendationsHeader = () => {
  return (
    <header className="mb-4">
      <h1 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
          <span className="text-emerald-600 text-lg">🥗</span>
        </span>
        Chat de recomendaciones de comida
      </h1>
      <p className="text-xs text-slate-500 mt-1">
        VitaAI analiza tus métricas, alergias y registros para sugerir opciones
        saludables según el momento del día.
      </p>
    </header>
  );
};

export default FoodRecommendationsHeader;
