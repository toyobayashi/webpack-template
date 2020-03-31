module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'standard'
  ],
  plugins: [
    'html',
    'vue'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  }
}
