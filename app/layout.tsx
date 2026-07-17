import type { Metadata, Viewport } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Lumi — Your AI Skin Care Specialist",
  description:
    "Lumi is an AI skincare specialist. Share a photo and get a personalized read on your skin type, concerns, and routine — powered by Claude vision.",
};

export const viewport: Viewport = {
  themeColor: "#f4f6f3",
};

// Set the theme before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
