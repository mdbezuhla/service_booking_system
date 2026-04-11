"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1c1c1e",
            color: "#fff",
            border: "1px solid #2c2c2e",
            borderRadius: "12px",
          },
          success: {
            iconTheme: {
              primary: "#8b5cf6",
              secondary: "#fff",
            },
          },
        }}
      />
    </SessionProvider>
  );
}
