import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://lesproductionsduchauve.netlify.app",
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Saira Extra Condensed",
      cssVariable: "--font-display",
      weights: [300, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["Arial Narrow", "sans-serif"],
    },
  ],
});
