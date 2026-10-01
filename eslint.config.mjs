import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cloudflare/OpenNext build output: a 12 MB bundled worker, never source.
    ".open-next/**",
    ".wrangler/**",
    // Separate Remotion project with its own package, lint and tsconfig.
    "remotion/**",
  ]),
]);

export default eslintConfig;
