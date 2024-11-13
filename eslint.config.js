import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  { languageOptions: { globals: globals.browser } },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-namespace": 'off',
    }
  },
  pluginReact.configs.flat.recommended,
  {
    settings: {
      "react": {
        "version": "detect"
      }
    }
  }
];