module.exports = {
  env: {
    browser: true,
    node: true,

    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-essential"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "no-console": "off",
    "no-inner-declarations": "off",
  },
};
