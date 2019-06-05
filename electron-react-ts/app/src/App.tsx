import * as React from 'react'
import { Route } from 'react-router-dom'
import Home from './Home'
import Package from './Package'

interface Props {}

interface States {}

class App extends React.Component<Props, States> {
  render () {
    return (
      <div>
        <Route exact path='/' component={Home} />
        <Route exact path='/package' component={Package} />
      </div>
    )
  }

  constructor (props: Props) {
    super(props)
  }
}

export default App
