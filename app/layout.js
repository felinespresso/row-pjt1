import "@/app/globals.css";
// import Navbar from "@/app/_components/navbar";
import { Montserrat } from "next/font/google";
import { AlertProvider } from "@/app/_context/AlertContext";
import LoadingIndicator from "@/app/_components/LoadingIndicator";
import SuccessPopup from "@/app/_components/SuccessPopup";
import DeleteConfirmationModal from "@/app/_components/DeleteConfirmationModal";
import { Suspense } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Aplikasi SIROW",
  icons: {
    icon: "/si.ico",
  },
};

export default function RootLayout({ children, modal }) {
  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <link rel="icon" href="/si.ico" type="image/ico" />
      </head>
      <body>
        <AlertProvider>
          <Suspense fallback={<LoadingIndicator />}>
            <main className="transition-all duration-300 ease-in-out">
              {children}
            </main>
          </Suspense>
        </AlertProvider>
        {modal}
      </body>
    </html>
  );
}
