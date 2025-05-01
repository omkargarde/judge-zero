import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["!node_modules/", "node_modules/*", "!dist", "dist/*"]),
  {
    rules: {
      "no-process-env": "error",
    },
  },
  {
    files: ["src/**/*.ts", "**/*.{ts}"],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: ".",
      },
    },
  },
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: ".",
      },
    },
  },
  perfectionist.configs["recommended-natural"],
  eslintConfigPrettier,
]);
