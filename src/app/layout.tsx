import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const BASE_URL = "https://upbbuilders.vercel.app";

export const metadata: Metadata = {
  title: "AWS Student Builder Group — UPB Cochabamba",
  description:
    "La comunidad de builders estudiantiles en la Universidad Privada Boliviana, Cochabamba. Construimos, aprendemos y enviamos juntos.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "AWS Student Builder Group — UPB Cochabamba",
    description:
      "Construyendo el futuro tech de Cochabamba. Membresía gratis para estudiantes UPB.",
    url: BASE_URL,
    siteName: "AWS UPB Builders",
    locale: "es_BO",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AWS Student Builder Group — UPB Cochabamba",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AWS Student Builder Group — UPB Cochabamba",
    description: "Construyendo el futuro tech de Cochabamba.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
