import { IconPlus } from "@tabler/icons-react";

interface Props {
  onClick: () => void;
}

export default function CreateMetricButton({ onClick }: Props) {
  return (
    <>
      {/* BOTÓN DESKTOP */}
      <button
        onClick={onClick}
        className="hidden sm:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-emerald-700 transition"
      >
        <IconPlus size={18} />
        Registrar métricas
      </button>

      {/* BOTÓN MÓVIL */}
      <div className="sm:hidden flex justify-end">
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white text-xs font-medium shadow-sm hover:bg-emerald-700 transition"
        >
          <IconPlus size={16} />
          Registrar métricas
        </button>
      </div>
    </>
  );
}
