module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        modules: false,
        useBuiltIns: 'entry',
        corejs: 2
      }
    ]
  ]
}
