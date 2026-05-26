import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./(users)/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    default: "Optical Galaxy & Gupta Optics | Best Eyewear in Delhi",
    template: "%s | Optical Galaxy & Gupta Optics"
  },
  description: "Optical Galaxy & Gupta Optics, serving Shastri Nagar, Delhi since 1930. Discover premium eyeglasses, sunglasses, and contact lenses with AI-powered diagnostic eye checkups.",
  keywords: ["Optical Galaxy", "Gupta Optics", "Opticians in Shastri Nagar", "Eyewear Delhi", "Best specs shop Delhi", "AI eye test Delhi", "custom prescription lenses", "sunglasses shop Shastri Nagar"],
  metadataBase: new URL("https://gupta-optics-website.vercel.app"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Optical Galaxy & Gupta Optics | Premium Eyewear & Diagnostics",
    description: "Serving Shastri Nagar, Delhi since 1930. Get premium eyewear, customized AI prescription testing, and prompt delivery.",
    url: "https://gupta-optics-website.vercel.app",
    siteName: "Optical Galaxy",
    images: [
      {
        url: "/shop-front.png",
        width: 1200,
        height: 630,
        alt: "Optical Galaxy & Gupta Optics Storefront"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Optical Galaxy & Gupta Optics | Premium Eyewear",
    description: "Premium eyeglasses, sunglasses, and contact lenses with advanced AI diagnostics in Shastri Nagar, Delhi.",
    images: ["/shop-front.png"],
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-full flex flex-col antialiased`}>
        <CartProvider>
          <CartDrawer />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
