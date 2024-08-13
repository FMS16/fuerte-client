// src/app/layout.js
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/features/ProductContext";
import { UserProvider } from "@/features/UserContext";
import { CartProvider } from "@/features/CartContext";
import Header from "@/components/Common/Header";
import { WishlistProvider } from "@/features/WishlistContext";
import Footer from "@/components/Common/Footer";
import { LayoutProvider } from "./LayoutProvider";
import { ToastContainer } from "react-toastify";

const montserrat = Montserrat({ subsets: [ "latin" ] });

export const metadata = {
  title: "Fuerte - tienda on-line.",
  description: "Fuerte, tienda deportiva de ropa femenina.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ProductProvider>
          <UserProvider>
            <WishlistProvider>
              <CartProvider>
                <LayoutProvider>
                  <main>{children}</main>
                </LayoutProvider>
              </CartProvider>
            </WishlistProvider>
          </UserProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
