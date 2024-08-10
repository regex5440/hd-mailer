import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["./src/lambda/**/*.ts"],
  bundle: true,
  outdir: "build",
  platform: "node",
  target: "node20",
});
