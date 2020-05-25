module.exports = {
    env: {
      browser: true,
      es6: true,
      node: true,
    },
    extends: ["eslint:recommended"],
    globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: "module",
    },
    //plugins: [ "@typescript-eslint"],
    rules: {
      "no-console": 0,
      "arrow-parens": "error",
      "eqeqeq": ["error", "always"],
      "no-unused-vars": [
        0,
        {
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "quotes": [
        "error",
        "double",
        { "avoidEscape": true , "allowTemplateLiterals": true }
    ],
    },
  };
