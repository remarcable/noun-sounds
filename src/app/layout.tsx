import type { Metadata } from "next";
import { Londrina_Solid } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const londrina = Londrina_Solid({
  weight: ["400", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noun Sounds",
  description: "Listen to your unique Noun transaction history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${londrina.className} antialiased`}>
        <main>
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
