"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-500/10 border-green-500/20 text-green-500",
    error: "bg-red-500/10 border-red-500/20 text-red-500",
    info: "bg-blue-500/10 border-blue-500/20 text-blue-500",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-top-2",
        colors[type]
      )}
      role="alert"
    >
      <Icon className="h-5 w-5" />
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast Context
interface ToastContextType {
  toasts: Array<{ id: string; message: string; type: "success" | "error" | "info" }>;
  addToast: (message: string, type: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<
    Array<{ id: string; message: string; type: "success" | "error" | "info" }>
  >([]);

  const addToast = React.useCallback(
    (message: string, type: "success" | "error" | "info") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
