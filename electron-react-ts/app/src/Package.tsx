import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'

function Package (props: RouteComponentProps) {
  const { location, history } = props
  return (
    <div>
      <button onClick={() => history.goBack()}>back</button>
      {location.pathname}
      <hr />
      <pre style={{ width: '100%',wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{JSON.stringify(require('../package.json'), null, 2)}</pre>
    </div>
  )
}

export default withRouter(Package)
