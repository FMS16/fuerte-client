// src/app/layout.js
import { Montserrat, Smooch } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/features/ProductContext";
import { UserProvider } from "@/features/UserContext";
import { CartProvider } from "@/features/CartContext";
import Header from "@/components/Common/Header";
import { WishlistProvider } from "@/features/WishlistContext";
import Footer from "@/components/Common/Footer";
import { LayoutProvider } from "./LayoutProvider";
import Image from "next/image";
import logo from "../assets/images/logoRecortadoFino.png"
import banner from "../assets/images/banner-coming-soon.jpeg"
import { ToastContainer } from "react-toastify";
import ModalCurrency from "@/components/Common/ModalCurrency";
import { CurrencyProvider } from "@/features/CurrencyContext";
import ComingSoon from "@/components/Common/ComingSoon";

const montserrat = Montserrat({ subsets: [ "latin" ] });

export const metadata = {
  title: "Fuerte - tienda on-line.",
  description: "Fuerte, tienda deportiva de ropa femenina.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={montserrat.className}>
        {/* <CurrencyProvider>
          <ProductProvider>
            <UserProvider>
              <WishlistProvider>
                <CartProvider>
                  <LayoutProvider>
                    <ModalCurrency />
                    <main>{children}</main>
                  </LayoutProvider>
                </CartProvider>
              </WishlistProvider>
            </UserProvider>
          </ProductProvider>
        </CurrencyProvider> */}
        <ComingSoon />
      </body>
    </html>
  );
}
