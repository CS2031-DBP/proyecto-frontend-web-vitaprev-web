import SummaryCard from "./SummaryCard";

export default function WeightCard({ weight }: { weight: number | null }) {
  return (
    <SummaryCard
      title="Peso actual"
      value={weight !== null ? `${weight.toFixed(1)} kg` : "—"}
    />
  );
}
