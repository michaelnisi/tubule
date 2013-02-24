
// tubule - get files

var request = require('request')
  , path = require('path')
  , fs = require('fs')
  , es = require('event-stream')
  , mkdirp = require('mkdirp')

module.exports = function (dir) {
  var stream = es.map(function (uri, callback) {
    mkdirp(dir, function (err) {
      if (err) {
        callback(err)
        return
      }

      var name = path.basename(uri)
        , target = path.join(dir, name)

      request(uri)
        .on('error', callback)
        .pipe(fs.createWriteStream(target))
          .on('error', callback)
          .on('close', function () {
            callback(null, target)
          })
    })
  })
  
  return stream
}
