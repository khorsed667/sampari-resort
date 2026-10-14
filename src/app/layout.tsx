import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/karla/wght.css";
import "./globals.css";

const siteUrl = "https://sampariresort.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sampari Resort | A Peaceful Escape in Sajek",
  description:
    "Stay among the clouds at Sampari Resort, Sajek — a peaceful wooden and bamboo eco-resort surrounded by the hills and nature of Sajek Valley.",
  keywords: [
    "Sampari Resort",
    "Sajek Valley",
    "Sajek resort",
    "Rangamati resort",
    "hill resort Bangladesh",
    "eco resort Sajek",
  ],
  openGraph: {
    title: "Sampari Resort | A Peaceful Escape in Sajek",
    description:
      "Stay among the clouds at Sampari Resort, Sajek — a peaceful wooden and bamboo eco-resort surrounded by the hills and nature of Sajek Valley.",
    url: siteUrl,
    siteName: "Sampari Resort",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sampari Resort | A Peaceful Escape in Sajek",
    description:
      "Stay among the clouds at Sampari Resort, Sajek — a peaceful wooden and bamboo eco-resort surrounded by the hills and nature of Sajek Valley.",
  },
};

export const viewport: Viewport = {
  themeColor: "#183C32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-cream text-forest antialiased">{children}</body>
    </html>
  );
}
