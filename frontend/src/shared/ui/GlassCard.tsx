import type { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
};

export const GlassCard = ({ children, className = "" }: Props) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className={`rounded-3xl border border-white/40 dark:border-white/10 bg-white/75 dark:bg-neutral-900/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] ${className}`}
    >
      {children}
    </motion.div>
  );
};