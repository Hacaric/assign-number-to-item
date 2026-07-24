import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Associations study",
  description: "Study of how we associate non-relevant stuff like numbers and object",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col items-center p-10">
        <div className="grid grid-cols-3">
          <div></div>
          <div></div>
          <div className="">
            <p>
              <a href="/account" className="absolute top-3 right-5">Account</a>
            </p>
          </div>
          <div className="cols-span-3 m-20 mt-10 min-w-[80vw] p-1 pt-0 border border-1px white rounded-3xl">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
