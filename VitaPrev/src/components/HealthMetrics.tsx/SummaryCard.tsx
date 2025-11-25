import { motion } from "framer-motion";

interface SummaryCardProps {
  title: string;
  value: string | number | null;
  footer?: React.ReactNode;
}

export default function SummaryCard({ title, value, footer }: SummaryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 px-5 py-5 
                 hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <p className="text-xs font-medium text-slate-500 uppercase">{title}</p>

      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {value !== null ? value : "—"}
      </p>

      {footer && <div className="mt-3">{footer}</div>}
    </motion.div>
  );
}
