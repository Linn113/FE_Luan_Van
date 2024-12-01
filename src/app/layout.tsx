import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/components/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MeLinhHealthyFood",
  description: "Welcome to MeLinhHealthyFood",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          background: "#F4FFE8",
          position: "relative",
        }}
        className={inter.className}
      >
        <ReactQueryProvider>
          {children}
          <Toaster />
        </ReactQueryProvider>
        <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1" />
        <df-messenger
          intent="WELCOME"
          chat-title="MeLinhHealthyBot"
          agent-id="396603cb-3254-483e-b5bf-8efeaaa745d7"
          language-code="vi"
        />
      </body>
    </html>
  );
}
