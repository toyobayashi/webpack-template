module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  parser: 'vue-eslint-parser',
  plugins: [
    'html',
    'vue'
  ],
  extends: [
    'standard-with-typescript'
  ],
  rules: {
    'no-irregular-whitespace': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'standard/no-callback-literal': 'off'
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2019,
    sourceType: 'module',
    project: './src/**/tsconfig.json',
    tsconfigRootDir: __dirname,
    extraFileExtensions: ['.vue'],
    createDefaultProgram: true
  },
  globals: {
    __non_webpack_require__: false
  }
}
