import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Room } from "./Room";
import NProgressProvider from "@/components/Common/NProgressProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NextDesign",
  description: "Your collaborative design making app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NProgressProvider>
          {children}
        </NProgressProvider>
      </body>
    </html>
  );
}
