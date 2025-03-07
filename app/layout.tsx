import "@/app/globals.css";
import { Montserrat } from "next/font/google";
import { AlertProvider } from "@/app/_context/AlertContext";
import LoadingIndicator from "@/app/_components/LoadingIndicator";
import { Suspense } from "react";
import { ProjectProvider } from "./_context/ProjectContext";
import SessionWrapper from "./_components/SessionWrapper";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Aplikasi SIROW",
  icons: {
    icon: "/si.ico",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <link rel="icon" href="/si.ico" type="image/ico" />
      </head>
      <body>
        <SessionWrapper>
          <ProjectProvider>
            <AlertProvider>
              <Suspense fallback={<LoadingIndicator />}>
                <main className="transition-all duration-300 ease-in-out">
                  {children}
                </main>
              </Suspense>
            </AlertProvider>
          </ProjectProvider>
        </SessionWrapper>

        <Suspense fallback={<LoadingIndicator />}>{modal}</Suspense>
      </body>
    </html>
  );
}
