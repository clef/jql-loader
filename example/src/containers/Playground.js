import React from 'react'
import Event from 'jql/types/Event'
import ActiveUsersQuery from 'jql/queries/ActiveUsers'

class Playground extends React.Component {
  constructor () {
    super()
    this.state = { data: null }
  }

  doQuery () {
    MP.api.jql(
      ActiveUsersQuery,
      {
        fromDate: moment().subtract(20, 'days').toDate(),
        toDate: moment().toDate(),
        events: []
      }
    ).done((results) => {
      this.setState({ data: results, queryTime: new Date() })
    })
  }

  componentDidMount () {
    this.doQuery()
  }

  componentDidUpdate (prevProps, prevState) {
    // We add this check so when Webpack hot reloads, the query is
    // automatically re-run.
    if (prevState.queryTime === this.state.queryTime) {
      this.doQuery()
    }
  }

  render () {
    return (
      <div>
        <h1 style={{marginBottom: 10}}>Active users over the last 7 days</h1>
        <pre>{ this.state.data ? JSON.stringify(this.state.data, null, 2) : "querying..." }</pre>
      </div>
    )
  }
}

export default Playground
