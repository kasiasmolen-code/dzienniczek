import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { EntriesProvider } from "@/lib/entries-context";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--font-poppins-var",
});

export const metadata: Metadata = {
  title: "Dzienniczek",
  description: "Twoje codzienne notatki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={cn("dark", poppins.variable, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <EntriesProvider>{children}</EntriesProvider>
      </body>
    </html>
  );
}
