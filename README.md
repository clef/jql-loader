# jql-loader

A loader to make writing Mixpanel JQL with code reuse easy.

## Usage

Install the `jql-loader` package via npm:

```shell
$ npm install jql-loader
```

Once it is installed, you can either use it in a require :

```javascript
var query = require("jql!./query.jql")
```

Or add it to your webpack config:

```json
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

## Caveats

Because of the way Mixpanel JQL is architected, every query needs to include all of the source necessary to run the `main` function. This means that every JQL query built with `jql-loader` will load _all_ of its dependencies. This means that if you have multiple JQL queries that depend on the same code, it will be loaded _multiple times_ into your JS bundle. This means your bundle can get very large very fast.

To limit this impact, *never* load large external libraries and try and keep your dependencies to a minimum.
