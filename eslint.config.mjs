import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.node, 
      },
      ecmaVersion: 2021,
      sourceType: "module", 
    },
  },
  pluginJs.configs.recommended,
];
