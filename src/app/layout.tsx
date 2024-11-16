import type { Metadata } from "next";
import { Londrina_Solid } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";

import "./globals.css";

const londrina = Londrina_Solid({
  weight: ["400", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Noun Sounds",
  description: "Onchain music: Use Nouns to listen to your unique tx history",
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
