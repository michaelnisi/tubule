
// starred - download starred Google Reader images

var boros = require('../index.js')
  , request = require('request')
  , imgscraper = require('imgscraper')
  , request = require('request')
  , fs = require('fs')
  , images = imgscraper()
  , dir = '/tmp/boros-' + Math.floor(Math.random() * (1<<24))
  , uri = 'https://www.google.com/reader/shared/user%2F00420557349755252971%2Fstate%2Fcom.google%2Fstarred?hl=en'

fs.mkdirSync(dir, 0700)

request(uri)
  .pipe(images)
  .pipe(boros(dir))
    .on('data', function (chunk) {
      console.log(chunk)
    })

