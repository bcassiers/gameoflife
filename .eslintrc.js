module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "eslint-config-prettier",
    "eslint-config-prettier/@typescript-eslint",
  ],
  rules: {
    strict: ["error", "never"],
    "react/prop-types": "off",
    "react/jsx-no-comment-textnodes": "off",
  },
  env: {
    browser: true,
    node: true,
  },
  ignorePatterns: [".eslintrc.js", "*.config.js"],
};
