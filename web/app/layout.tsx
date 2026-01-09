import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "./components/theme/ThemeProvider";
import { AuthProvider } from "./components/auth/AuthContext";
import { ToastContainer } from "react-toastify";
import AuthGuard from "@/components/protectedlayout/AuthGuard";

export const metadata: Metadata = {
  title: "Polaris Prime Air Tech Corp",
  description: "End-to-end visibility for HVAC inventory & operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>{children}</AuthGuard>
            <ToastContainer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
