const eslint = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const importPlugin = require("eslint-plugin-import");
const prettierPlugin = require("eslint-plugin-prettier");
const prettierConfig = require("eslint-config-prettier");

module.exports = [
  {
    files: ["**/*.ts"],
    ignores: ["dist/**", "node_modules/**"],
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setImmediate: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        module: "readonly",
        require: "readonly",
        describe: "readonly",
        test: "readonly",
        it: "readonly",
        expect: "readonly",
        jest: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      ...eslint.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,

      "prettier/prettier": "error",

      "no-unused-vars": "off",
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          alphabetize: { order: "asc", caseInsensitive: true },
          "newlines-between": "always",
        },
      ],

      "import/no-unresolved": "error",

      "@typescript-eslint/consistent-type-imports": "warn",
      "no-console": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "error",
    },
  },
];
