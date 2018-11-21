import './style.css'
import { AppContainer } from 'react-hot-loader'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

const render = (Component: typeof React.Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)

if ((module as any).hot) {
  (module as any).hot.accept()
}
