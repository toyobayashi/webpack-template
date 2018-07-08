import React from 'react'

export default class App extends React.Component {
  render () {
    return (
      <div className={'root'}>
        <p>{this.state.text}</p>
        <button onClick={this.click}>click</button>
      </div>
    )
  }

  constructor (props) {
    super(props)
    this.state = {
      text: 'React JavaScript'
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
