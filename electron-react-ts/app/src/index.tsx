import './style.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

const render = (Component: typeof React.Component) => {
  ReactDOM.render(
    <Component />,
    document.getElementById('root')
  )
}

render(App)

if (process.env.NODE_ENV !== 'production') {
  if ((module as any).hot) {
    (module as any).hot.accept()
  }
}
