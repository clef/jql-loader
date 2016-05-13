# jql-loader

A loader to make writing Mixpanel JQL with code reuse easy.

## Usage

Install the `jql-loader` package via npm:

```shell
$ npm install --save-dev jql-loader
```

Add it to your webpack config:

```javascript
{
    loaders: [
        {
            test: /\.jql$/,
            exclude: /node_modules/,
            loaders: ['jql-loader', 'babel-loader']
        }
    ]
}
```

Write a new query file that exports a `main` function. You can `require` in this file as if it was a normal file being built with webpack.

```javascript
import * as DateHelper from 'jql/helpers/DateHelper'

function main () {
  return Events({
    from_date: DateHelper.formatDate(params.fromDate),
    to_date: DateHelper.formatDate(params.toDate),
    event_selectors: params.events
  })
  .groupByUser([event => {
    return new Date(event.time).toISOString().substr(0, 10)
  }], mixpanel.reducer.noop())
  .groupBy(['key.1'], mixpanel.reducer.count())
}

export default main
```

Then require and run the JQL query:

```javascript
let ActiveUsersQuery = require('jql/queries/ActiveUsers.jql')
MP.api.jql(
    ActiveUsersQuery,
    {
        fromDate: moment().subtract(20, 'days').toDate(),
        toDate: moment().toDate(),
        events: []
    }
).done((results) => {
    console.log(results)
})
```

## Example

If you'd like to see an example `webpack.config.js` and project, check out the [example/](example/) folder. It can also serve as a nice playground for writing reusable JQL queries.

## Caveats

Because of the way Mixpanel JQL is architected, every query needs to include all of the source necessary to run the `main` function. This means that every JQL query built with `jql-loader` will load _all_ of its dependencies. This means that if you have multiple JQL queries that depend on the same code, it will be loaded _multiple times_ into your JS bundle. This means your bundle can get very large very fast.

To limit this impact, *never* load large external libraries and try and keep your dependencies to a minimum.
