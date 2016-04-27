var SingleEntryPlugin = require("webpack/lib/SingleEntryPlugin")
var path = require("path")
var loaderUtils = require("loader-utils")
var MemoryFS = require("memory-fs")

module.exports = function() {}
module.exports.pitch = function(request) {
  if(!this.webpack) throw new Error("Only usable with webpack")

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
  jqlCompiler.apply(new SingleEntryPlugin(this.context, "!!" + request, "main"))

  var subCache = "subcache " + __dirname + " " + request
  jqlCompiler.plugin("compilation", function(compilation) {
    if(compilation.cache) {
      if(!compilation.cache[subCache])
        compilation.cache[subCache] = {}
      compilation.cache = compilation.cache[subCache]
    }
  })

  jqlCompiler.compile(function(err, compilation) {
    if(err) return callback(err)

    var source = compilation.assets[compilation.hash + ".jql.js"].source()
    var strFn = "function main() { var _main = " + source + " \n return _main() }"
    return callback(null, "module.exports = " + JSON.stringify(strFn))
  })
}
