import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import PopupProvider from "./PopupProvider";
import NavbarProvider from "./NavbarProvider";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><StoreProvider><PopupProvider><NavbarProvider>{children}</NavbarProvider></PopupProvider></StoreProvider></body>
    </html>
  );
}
