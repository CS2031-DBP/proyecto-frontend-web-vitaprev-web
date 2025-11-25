import SummaryCard from "./SummaryCard";

interface Props {
  imc: number | null;
  estado: { label: string; color: string };
}

export default function ImcCard({ imc, estado }: Props) {
  return (
    <SummaryCard
      title="IMC"
      value={imc !== null ? imc.toFixed(1) : "—"}
      footer={
        <span
          className={`inline-flex px-2 py-1 rounded-full text-[11px] font-medium ${estado.color}`}
        >
          {estado.label}
        </span>
      }
    />
  );
}
