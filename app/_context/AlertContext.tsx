"use client";

import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdErrorOutline } from "react-icons/md";

type AlertType = "success" | "error";

interface AlertContextType {
  showAlert: (message: string, type: AlertType) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alert, setAlert] = useState<{
    message: string;
    type: AlertType;
    isVisible: boolean;
  }>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showAlert = (message: string, type: AlertType) => {
    setAlert({ message, type, isVisible: true });
    setTimeout(() => {
      setAlert((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {alert.isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div
              className="flex items-center gap-3 min-w-[320px] px-4 py-3 rounded-lg shadow-lg bg-white border-l-4 border-r-4 border-t-2 border-b-2"
              style={{
                borderColor: alert.type === "success" ? "#22c55e" : "#ef4444",
              }}
            >
              <div className="flex-shrink-0">
                {alert.type === "success" ? (
                  <IoMdCheckmarkCircleOutline className="w-6 h-6 text-green-500" />
                ) : (
                  <MdErrorOutline className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="flex-1 text-sm font-semibold text-gray-600">
                {alert.message}
              </p>
              <button
                onClick={() => setAlert((prev) => ({ ...prev, isVisible: false }))}
                className="px-3 py-1 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100"
              >
                OK
              </button>
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