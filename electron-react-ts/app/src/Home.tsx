import * as React from 'react'
import { connect } from 'react-redux'
import { AppState, AppAction, commitCount } from './store'
import { Dispatch } from 'redux'
import { Link } from 'react-router-dom'

interface Props {
  count?: number
  dispatch?: Dispatch<AppAction>
  commitCount? (): AppAction<number>
}

interface States {}

class Home extends React.Component<Props, States> {
  render () {
    return (
      <div className={'root'}>
        <h1 className='title'>Electron React TypeScript</h1>
        <div>React: {React.version}</div>
        <div>Electron: {process.versions.electron}</div>
        <div className='content' onClick={this.props.commitCount}>Component State: {this.props.count}</div>
        <button onClick={this.toggleDevtools}>devtools</button>
        <Link to='/package'>package</Link>
      </div>
    )
  }

  constructor (props: Props) {
    super(props)
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

export default connect(
  (state: AppState, _ownProps: Props) => ({
    count: state.count
  }),
  (dispatch: Dispatch<AppAction>, _ownProps: Props) => ({
    dispatch,
    commitCount: () => dispatch(commitCount(1))
  })
)(Home)
