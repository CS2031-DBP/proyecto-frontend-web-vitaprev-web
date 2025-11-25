import SummaryCard from "./SummaryCard";

export default function LastUpdateCard({ date }: { date: string | null }) {
  return (
    <SummaryCard
      title="Última actualización"
      value={date ?? "—"}
    />
  );
}
