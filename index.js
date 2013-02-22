
// tubule - download files

var request = require('request')
  , path = require('path')
  , fs = require('fs')
  , es = require('event-stream')

module.exports = function (dir) {
  var stream = es.map(function (uri, callback) {
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

  return stream
}
