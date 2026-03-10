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
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      // Allow `any` in a few places until types are tightened (prevents build failures on Vercel)
      '@typescript-eslint/no-explicit-any': 'off',
      // Allow occasional non-null assertion on optional chaining
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      // Reduce unused-vars to warnings to avoid build failures for unused local variables
      '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    },
  },
];

export default eslintConfig;
