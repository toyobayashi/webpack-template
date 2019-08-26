module.exports = {
  presets: [
    '@babel/preset-react'
  ],
  plugins: process.env.NODE_EMV !== 'production' ? ['react-hot-loader/babel'] : []
}
