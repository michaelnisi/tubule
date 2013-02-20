
// starred - download all images from starred Google Reader items

var boros = require('../')
  , request = require('request')
  , scrimg = require('scrimg')
  , trumpet = require('trumpet')
  , request = require('request')
  , fs = require('fs')
  , cop = require('cop')
  , urls = scrimg()
  , filterURL = require('./filterURL')
  , next = null
  
var max = 1
  , pageCount = 0
  , dir = '/tmp/boros-' + Math.floor(Math.random() * (1<<24))
  , first = 'https://www.google.com/reader/shared/user%2F00420557349755252971%2Fstate%2Fcom.google%2Fstarred?hl=en'

fs.mkdirSync(dir, 0700)

function download (uri) {
  request(uri)
    .pipe(urls)
      .on('end', function (more) {
        next = more
      })
    .pipe(cop(filterURL))
    .pipe(boros(dir))
      .on('data', function (chunk) {
        console.log('file %s', chunk)
      })
      .on('end', function () {
        if (next) {
          pageCount++
          if (pageCount < max) {
            download(next)
          }
          next = null
        } else {
          console.log('OK')
        }
      })
}

download(first)
