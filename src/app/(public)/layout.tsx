import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://mahaproperties.in"),

  title: {
    default: "MahaProperties",

    template: "%s | MahaProperties",
  },

  description:
    "Verified property listings in Maharashtra including NA plots, agriculture land, commercial and residential properties.",

  openGraph: {
    title: "MahaProperties",

    description: "Explore verified properties across Maharashtra.",

    url: "https://mahaproperties.in",

    siteName: "MahaProperties",

    images: [
      {
        url: "/maha.png",

        width: 1200,

        height: 630,

        alt: "MahaProperties",
      },
    ],

    locale: "en_IN",

    type: "website",
  },

  twitter: {
    card: "summary_large_image",

    title: "MahaProperties",

    description: "Verified properties across Maharashtra.",

    images: ["/maha.png"],
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
