# jql-loader

A loader to make writing Mixpanel JQL with code reuse easy.

## Usage

Install the `jql-loader` package via npm:

```shell
$ npm install jql-loader
```

Add it to your webpack config:

```javascript
{
    loaders: [
        {
            test: /\.jql$/,
            exclude: /node_modules/,
            loader: 'jql-loader'
        }
    ]
}
```

Write a new query file that exports a `main` function. You can `require` in this file as if it was a normal file being built with webpack.

```javascript
var OtherCode = require('./some/other/code')

function main() {
    return Events({
        from_date: '2015-01-01',
        to_date: '2015-06-01'
    })
    .groupByUser(OtherCode.reducer)
}

module.exports = main
```

Then require and run the JQL query:

```javascript
let query = require('./jql/queries/retention.jql')
MP.api.jql(query).done((results) => {
    console.log(results)
})
```

## Caveats

Because of the way Mixpanel JQL is architected, every query needs to include all of the source necessary to run the `main` function. This means that every JQL query built with `jql-loader` will load _all_ of its dependencies. This means that if you have multiple JQL queries that depend on the same code, it will be loaded _multiple times_ into your JS bundle. This means your bundle can get very large very fast.

To limit this impact, *never* load large external libraries and try and keep your dependencies to a minimum.
