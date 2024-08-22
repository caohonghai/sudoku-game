import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sudoku Game",
  description: "A simple sudoku game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        {/* footer */}
        <footer className="text-sm bg-white text-center text-gray-400 py-4">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <a href="https://antcao.me" className="underline">
              Ant Cao
            </a>
            . All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
