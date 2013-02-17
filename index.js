
// boros - download files

var request = require('request')
  , Stream = require('stream').Stream
  , path = require('path')
  , url = require('url')
  , fs = require('fs')
  , done

module.exports = function (dir) {
  var stream = new Stream()

  stream.writable = true
  stream.readable = true

  stream.error = function (err) {
    stream.emit(err)
  }

  stream.end = function () {
    stream.emit('end')
  }

  stream.write = function (img) {
    var name = path.basename(img)
      , target = path.join(dir, name)

    request(img)
      .pipe(fs.createWriteStream(target))
        .on('close', function (chunk) {
          stream.emit('data', target)
        })
  }

  return stream
}

