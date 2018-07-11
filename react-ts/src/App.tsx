import * as React from 'react'

class App extends React.Component<{}, { text: string }> {
  render () {
    return (
      <div className={'root'}>
        <p>{this.state.text}</p>
        <button onClick={this.click}>click</button>
      </div>
    )
  }

  constructor (props: {}) {
    super(props)
    this.state = {
      text: 'React TypeScript'
    }
    this.click = this.click.bind(this)
  }

  click () {
    this.setState((prevState) => {
      return {
        text: prevState.text + '!!!'
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

export default process.env.NODE_ENV !== 'production' ? require('react-hot-loader').hot(module)(App) : App
