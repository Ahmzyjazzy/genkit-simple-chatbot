import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieNotice from "./cookie-notice";
import WithFirebase from "./firebase";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Genkit",
    default: "Simple Chatbot",
  },
  description:
    "Common patterns for apps incorporating GenAI, powered by Genkit.",
};

function App({ children }: { children: React.ReactNode }) {
  return (
      <WithFirebase>
        {children}
      </WithFirebase>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <CookieNotice>
          <App>{children}</App>
        </CookieNotice>
      </body>
    </html>
  );
}
