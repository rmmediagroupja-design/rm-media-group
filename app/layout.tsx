import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";
import "@fontsource-variable/playfair-display";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    template: "%s | RM Media Group JA",
    default: "RM Media Group JA — Photography, Videography & Social Media",
  },
  description:
    "RM Media Group JA — Jamaica's premium photography, videography, and social media marketing agency. Cinematic storytelling for luxury brands and unforgettable events.",
  keywords: ["photography Jamaica", "videography Kingston", "social media marketing Jamaica", "wedding photographer"],
  openGraph: {
    siteName: "RM Media Group JA",
    locale: "en_JM",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans" suppressHydrationWarning>
        <SessionProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#161616",
                color: "#fff",
                border: "1px solid #252525",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
