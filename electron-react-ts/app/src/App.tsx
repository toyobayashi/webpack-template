import * as React from 'react'

interface IProps {}

interface IStates {
  count: number
}

class App extends React.Component<IProps, IStates> {
  render () {
    return (
      <div className={'root'}>
        <h1 className='title'>Electron React TypeScript</h1>
        <div>React: {React.version}</div>
        <div>Electron: {process.versions.electron}</div>
        <div className='content' onClick={this.test}>Component State: {this.state.count}</div>
        <button onClick={this.toggleDevtools}>devtools</button>
      </div>
    )
  }

  constructor (props: {}) {
    super(props)
    this.state = {
      count: 0
    }
    this.test = this.test.bind(this)
  }

  test () {
    this.setState((prevState) => {
      return {
        count: prevState.count + 1
      }
    })
  }

  toggleDevtools () {
    const webContents = require('electron').remote.webContents.getFocusedWebContents()
    if (webContents.isDevToolsOpened()) {
      webContents.closeDevTools()
    } else {
      webContents.openDevTools()
    }
  }
}

(async function () {
  const ms = await (ms => new Promise(resolve => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  }))(1000)
  console.log(ms)
})()

export default App
