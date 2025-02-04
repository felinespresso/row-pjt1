import "@/app/globals.css";
// import Navbar from "@/app/_components/navbar";
import { Montserrat } from "next/font/google";
import { AlertProvider } from "@/app/_context/AlertContext";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Aplikasi SIROW",
  icons: {
    icon: "/si.ico",
  },
};

export default function RootLayout({
  children, modal
}) {

  return (
    <html lang="en" className={montserrat.className}>
      <head>
        <link rel="icon" href="/si.ico" type="image/ico" />
      </head>
      <body>
        <AlertProvider>{children}</AlertProvider>
        {modal}
      </body>
    </html>
  );
}

