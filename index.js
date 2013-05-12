
// tubule - copy files from stream of URIs

var path = require('path')
  , fs = require('fs')
  , http = require('http')
  , https = require('https')
  , url = require('url')
  , Transform = require('stream').Transform
  , mkdirp = require('mkdirp')

module.exports = function (dir) {
  var stream = new Transform()

  stream._transform = function (chunk, enc, cb) {
    mkdirp(dir, function (err) {
      if (err) {
        stream.emit('error', err)
        return
      }

    var uri = chunk.toString()
      , name = path.basename(uri)
      , target = path.join(dir, name)
      , get = iface(uri).get

    get(uri, function (res) {
        res
          .on('error', function (err) {
            stream.emit('error', err)
          })
          .pipe(fs.createWriteStream(target))
          .on('error', function (err) {
            stream.emit('error', err)
          })
          .on('close', function () {
            stream.push(target)
            cb()
          })
      })
    })
  }

  return stream
}

function iface(uri) {
  return url.parse(uri) === 'https:' ? https : http
}
