import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ServiceWorker from "./components/serviceWorker";
import ProgressBar from "./components/progressBar";

const nasalization = localFont({
  src: "./fonts/nasalization/Nasalization Rg.otf",
});

const archivo = localFont({
  src: [
    {
      path: "./fonts/Archivo/Archivo-VariableFont_wdth,wght.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Archivo/Archivo-Italic-VariableFont_wdth,wght.ttf",
      weight: "400",
      style: "italic",
    },
    // {
    //   path: './Roboto-Bold.woff2',
    //   weight: '700',
    //   style: 'normal',
    // },
    // {
    //   path: './Roboto-BoldItalic.woff2',
    //   weight: '700',
    //   style: 'italic',
    // },
  ],
});

export const metadata: Metadata = {
  title: "Unreal",
  description: "Ai image generation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`background-color-primary-1 text-primary-11 ${archivo.className} ${nasalization.className}`}
      >
        <ProgressBar />
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
