import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser, 
        ...globals.jest,  
      },
      sourceType: "module"
    }
  },
  pluginJs.configs.recommended
];


