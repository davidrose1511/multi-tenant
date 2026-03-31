// components/public/shared-components-public/fonts.tsx
import { Cormorant_Garamond, Tenor_Sans } from "next/font/google";

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display", // keep this for headings
  display: "swap",
});

export const tenorSans = Tenor_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans", // we'll alias this to --font-sans below
  display: "swap",
});
