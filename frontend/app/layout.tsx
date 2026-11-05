import "./globals.css";
import "./theme.css";
import "./eclectic.css";
import "./refinements.css";
import "./theme-wave.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Хетаг Дарчиев — Fullstack-разработчик",
  description:
    "Fullstack-разработка с фокусом на frontend. React, Next.js, Go. Проекты, навыки и контакты Хетага Дарчиева.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='dark'?'dark':'light'}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
