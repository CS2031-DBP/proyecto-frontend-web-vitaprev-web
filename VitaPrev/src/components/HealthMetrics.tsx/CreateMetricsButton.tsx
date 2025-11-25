import { IconPlus } from "@tabler/icons-react";
import { motion } from "framer-motion";

interface CreateMetricsButtonProps {
  onClick: () => void;
  size?: "sm" | "md";
  className?: string;
}

export default function CreateMetricsButton({
  onClick,
  size = "md",
  className = "",
}: CreateMetricsButtonProps) {
  const baseStyles =
    "inline-flex items-center gap-2 rounded-xl bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition";

  const sizeStyles =
    size === "sm"
      ? "px-3 py-2 text-xs"
      : "px-4 py-2 text-sm";

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.03 }}
      className={`${baseStyles} ${sizeStyles} ${className}`}
    >
      <IconPlus size={size === "sm" ? 16 : 18} />
      Registrar métricas
    </motion.button>
  );
}
