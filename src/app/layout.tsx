import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/components/providers/trpc-provider";

export const metadata: Metadata = {
  title: "Todo List",
  description: "Todo list with tRPC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
