import * as React from 'react'

class App extends React.Component<{}, { count: number }> {
  render () {
    return (
      <div className={'root'}>
        <h1 className='title'>Electron React TypeScript</h1>
        <div>React: {React.version}</div>
        <div>Electron: {process.versions.electron}</div>
        <div className='content' onClick={this.test}>Component State: {this.state.count}</div>
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
