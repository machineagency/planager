import { hmrPlugin, presets } from "@open-wc/dev-server-hmr";

/** Use Hot Module replacement by adding --hmr to the start command */
const hmr = process.argv.includes("--hmr");

export default {
  open: "/",
  port: 8000,
  watch: !hmr,
  nodeResolve: {
    exportConditions: ["browser", "development"],
  },

  plugins: [
    /** Use Hot Module Replacement by uncommenting. Requires @open-wc/dev-server-hmr plugin */
    hmr &&
      hmrPlugin({
        exclude: ["**/*/node_modules/**/*"],
        presets: [presets.lit],
      }),
  ],
};
