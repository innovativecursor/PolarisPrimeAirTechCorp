import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "./components/theme/ThemeProvider";

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
