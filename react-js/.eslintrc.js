module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: 'babel-eslint',
  extends: [
    'standard',
    'plugin:react/recommended'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
}
