"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertContextType {
  showAlert: (message: string, type: "success" | "error") => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false,
  });

  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type, visible: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, visible: false }));
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {alert.visible && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed top-4 left-0 right-0 mx-auto z-50 flex justify-center"
          >
            <div
              className={`flex items-center gap-3 w-[90%] max-w-md px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-r-4 border-t-2 border-b-2 ${
                alert.type === "success"
                  ? "border-green-500"
                  : "border-red-500"
              } border-opacity-50`}
            >
              <p
                className={`flex-1 text-sm font-semibold ${
                  alert.type === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {alert.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
} 