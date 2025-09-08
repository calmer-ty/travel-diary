import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },

  // 특정 디렉토리 예외 (shadcn/ui)
  {
    files: ["src/components/ui/**"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "off",
    },
  },
];

export default eslintConfig;
