import "./globals.css";
import AppProvider from "@/app/app-provider";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
