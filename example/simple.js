
// simple - example

var tubule = require('../')
  , es = require('event-stream')
  , cop = require('cop')
  , path = require('path')
  , dir = '/tmp/tubule-' + Math.floor(Math.random() * (1<<24))

var urls = [
  'https://npmjs.org/static/npm.png'
, 'http://nodejs.org/images/logos/nodejs-1024x768.png'
]

es.readArray(urls)
  .pipe(tubule(dir))
  .pipe(cop(function (filename) { return filename + '\n' }))
  .pipe(process.stdout)
