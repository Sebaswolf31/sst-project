import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import VisibleWrapper from "./wrappers/visibleWraper";
import Footer from "./components/footer";
import Navbar from "./components/navbar";
import { AuthProvider } from "./contexts/authContext";
import { Toaster } from "react-hot-toast";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SST Project",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={` antialiased ${nunito.variable}`}>
        <AuthProvider>
          <VisibleWrapper>
            <Navbar />
          </VisibleWrapper>
          <Toaster
            toastOptions={{
              success: {
                style: {
                  background: "green",
                },
              },
              error: {
                style: {
                  background: "red",
                },
              },
              position: "top-center",
            }}
          />

          {children}
          <VisibleWrapper>
            <Footer />
          </VisibleWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
