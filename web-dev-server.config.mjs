import { hmrPlugin, presets } from "@open-wc/dev-server-hmr";
import proxy from "koa-proxies";

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes("--hmr");
const dev = process.argv.includes("--dev");

export default {
  open: "/",
  port: 8000,
  watch: !hmr,
  nodeResolve: {
    exportConditions: ["browser", "development"],
  },

  // debug: dev,
  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    hmr &&
      hmrPlugin({
        exclude: ["**/*/node_modules/**/*"],
        presets: [presets.lit],
      }),
  ],
  middleware: [
    proxy("/socket.io", {
      target: "http://0.0.0.0:5000",
      logs: true,
      // changeOrigin: true,
      // secure: false,
      ws: true,
    }),
  ],
};
