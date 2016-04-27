var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin")
var path = require("path")
var loaderUtils = require("loader-utils")
var MemoryFS = require("memory-fs")

module.exports = function(content) {
  if(!this.webpack) throw new Error("Only usable with webpack")
  if (this._compiler.isChild()) return content

  var callback = this.async()
  var query = loaderUtils.parseQuery(this.query)
  var filename = loaderUtils.interpolateName(this, query.name || "[hash].jql.js", {
    context: query.context || this.options.context,
    regExp: query.regExp
  })

  var outputOptions = {
    filename: filename,
    chunkFilename: "[id]." + filename,
    namedChunkFilename: null
  }

  var jqlCompiler = this._compilation.createChildCompiler("jql", outputOptions)
  jqlCompiler.outputFileSystem = new MemoryFS()
  jqlCompiler.apply(new SingleEntryPlugin(this.context, "!!" + this.request, "main"))

  var subCache = "subcache " + __dirname + " " + this.request
  jqlCompiler.plugin("compilation", function(compilation) {
    if(compilation.cache) {
      if(!compilation.cache[subCache])
        compilation.cache[subCache] = {}
      compilation.cache = compilation.cache[subCache]
    }
  })

  jqlCompiler.runAsChild(function(err, entries, compilation) {
    if(err) return callback(err)

    var file = compilation.assets[compilation.hash + ".jql.js"]
    if (file) {
      var source = file.source()
      var strFn = "function main() { var _main = " + source + " \n if(_main.default) { return _main.default() } else { return _main() } }"
      return callback(null, "module.exports = " + JSON.stringify(strFn))
    } else {
      return callback(null, null)
    }
  })
}
