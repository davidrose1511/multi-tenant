// components/public/shared-components-public/fonts.tsx
import { Cormorant_Garamond, Jost } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const jost = Jost({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jost",
  display: "swap",
});
