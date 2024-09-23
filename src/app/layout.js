// src/app/layout.js
import { Montserrat, Oooh_Baby } from "next/font/google";
import "./globals.css";
import { ProductProvider } from "@/features/ProductContext";
import { UserProvider } from "@/features/UserContext";
import { CartProvider } from "@/features/CartContext";
import { WishlistProvider } from "@/features/WishlistContext";
import { LayoutProvider } from "./LayoutProvider";
import ModalCurrency from "@/components/Common/ModalCurrency";
import { CurrencyProvider } from "@/features/CurrencyContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react"

const montserrat = Montserrat({ subsets: [ "latin" ] });
const oooh_Baby = Oooh_Baby({ subsets: [ "latin" ], weight:['400'] });

export const metadata = {
  title: "FUERTE",
  description: "Descubre Fuerte, tu tienda deportiva especializada en ropa femenina...",
  keywords: "tienda deportiva, ropa femenina, moda deportiva, ropa fitness mujeres, Vicky Turusha, Fuerte marca, Fuerte tienda deportiva, ropa deportiva mujeres, moda fitness, ropa deportiva Fuerte, tienda de deportes Fuerte, marca Fuerte, ropa para mujeres",
  author: "Fabricio Secondo",
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={montserrat.className}>
        <CurrencyProvider>
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
        </CurrencyProvider>
        <SpeedInsights /> 
        <Analytics />
      </body>
    </html>
  );
}
