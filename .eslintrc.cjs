module.exports =
  {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends:
      [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "prettier",
        "plugin:prettier/recommended",
      ],
    parserOptions:
      {
        ecmaVersion:
          "latest",
        sourceType:
          "module",
        ecmaFeatures:
          {
            jsx: true,
          },
      },
    settings:
      {
        react:
          {
            version:
              "detect",
          },
      },
    plugins:
      [
        "react",
        "prettier",
      ],
    rules:
      {
        "prettier/prettier":
          "error",
      },
  }
