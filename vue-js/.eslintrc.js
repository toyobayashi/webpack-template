module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['standard'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'html',
    'vue'
  ]
}
