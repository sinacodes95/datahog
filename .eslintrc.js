module.exports = {
    env: {
      commonjs: true,
      es6: true,
      node: true,
      jasmine: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:jest/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2019,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    plugins: [
      '@typescript-eslint',
    ],
    rules: {
      "complexity": ["error", { max: 10 }],
      "@typescript-eslint/no-floating-promises": ["error"],
      "@typescript-eslint/prefer-for-of": ["error"],
      "@typescript-eslint/no-unnecessary-condition": ["error", { "allowConstantLoopConditions": true }],
      "@typescript-eslint/no-misused-promises": "off",
      "no-useless-escape": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/require-await": "off"
    }
  }
