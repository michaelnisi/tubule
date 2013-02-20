
// boros - download files

var request = require('request')
  , Stream = require('stream').Stream
  , path = require('path')
  , fs = require('fs')

module.exports = function (dir) {
  var stream = new Stream()
    , buffer = []

  stream.writable = true
  stream.readable = true

  stream.error = function (err) {
    stream.emit(err)
  }

  stream.end = function (chunk) {
    stream.emit('end')
  }

  stream.write = function (url) {
    var name = path.basename(url)
      , target = path.join(dir, name)
  
    buffer.push(url)

    request(url)
      .on('error', function (err) {
        next(err)
      })
      .pipe(fs.createWriteStream(target))
        .on('close', function (chunk) {
          next(target)
        })
  }

  function next (data) {
    stream.emit('data', data)
    buffer.shift()
    if (!buffer.length) {
      stream.emit('end')
    }
  }

  return stream
}
