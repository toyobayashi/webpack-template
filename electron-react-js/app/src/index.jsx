import './style.css'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.jsx'

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) module.hot.accept()
}
