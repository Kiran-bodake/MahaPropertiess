import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";
import "@/styles/x-admin.scss";

import Providers from "./providers";

import { PageTransitionProvider } from "@/components/shared/PageTransitionProvider";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import LocationProvider from "@/components/providers/LocationProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-dm",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MahaProperties — Nashik's #1 Property Portal",
  description:
    "Find NA plots, agriculture land, commercial & industrial properties in Nashik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en" className={dmSans.variable}>
      <body style={{ fontFamily: "var(--font-dm, 'DM Sans', sans-serif)" }}>

        {/* Google Analytics (Production Safe) */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />

            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}

        {/* App Providers */}
        <Providers>
          <ScrollReveal />
          <LocationProvider>
            <PageTransitionProvider>{children}</PageTransitionProvider>
          </LocationProvider>
        </Providers>

      </body>
    </html>
  );
}