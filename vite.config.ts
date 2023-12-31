import { defineConfig, splitVendorChunkPlugin } from "vite";
import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin(), svgr()],
  build: {
    rollupOptions: {
      treeshake: true,
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      input: {
        popup: resolve(__dirname, "popup.html"),
        background: resolve(__dirname, "logic", "background.ts"),
        "content-script": resolve(__dirname, "logic", "content-script.ts"),
        shifronim: resolve(__dirname, "logic", "shifronim.scss"),
      },
    },
    cssCodeSplit: true,
  },
});
