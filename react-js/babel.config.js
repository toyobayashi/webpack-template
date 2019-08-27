module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env', {
        modules: false
      }
    ]
  ],
  plugins: process.env.NODE_EMV !== 'production' ? ['react-hot-loader/babel'] : []
}
