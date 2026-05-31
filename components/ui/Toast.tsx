"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#1A0A22",
          borderRadius: "16px",
          border: "1px solid #E9D8F5",
          boxShadow: "0 4px 24px rgba(59, 19, 71, 0.12)",
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#3B1347",
            secondary: "#F4D1FF",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#FFF",
          },
        },
      }}
    />
  );
}
