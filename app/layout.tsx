import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import GA from "@/components/GA";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});



export const metadata: Metadata = {
  title: "convert.wasm - Free Unlimited File Converter",
  description: `The ultimate online tool for
unlimited and free multimedia conversion. Transform images, audio, and
videos effortlessly, without restrictions. Start converting now and
elevate your content like never before!`,
  creator: "Anoop P K",
  keywords: "image converter, video converter, audio converter, unlimited image converter, unlimited video converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GA GA_MEASUREMENT_ID="G-8G57BM7VEY" />
      <meta name="google-site-verification" content="eObP1f3jmsXYzoX08FtrZxKN-ZIwbmuAQjQPHIY-CXg" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white bg-black`}
      >
        <div className="px-8 md:px-32 py-8">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
