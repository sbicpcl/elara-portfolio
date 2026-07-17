import type { Metadata, Viewport } from "next";
import "./globals.css";
import Preloader from "@/components/Preloader";
import Nav from "@/components/Nav";
import Effects from "@/components/Effects";

export const metadata: Metadata = {
  title: "Elara Vance — Product & Interaction Designer",
  description:
    "Elara Vance is a product & interaction designer crafting expressive, human-centered digital products.",
};

export const viewport: Viewport = {
  themeColor: "#15120f",
};

// Set the theme before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Preloader />
        <Effects />
        <Nav />
        {children}
      </body>
    </html>
  );
}
