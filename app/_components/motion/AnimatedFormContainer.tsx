"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedFormContainerProps {
  children: ReactNode;
}

export default function AnimatedFormContainer({
  children,
}: AnimatedFormContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      {children}
    </motion.div>
  );
}
