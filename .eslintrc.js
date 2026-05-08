module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "next",
    "next/core-web-vitals",
  ],
  rules: {
    // Your custom rules here
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
