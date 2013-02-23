
// simple - example

var tubule = require('../')
  , es = require('event-stream')
  , cop = require('cop')
  , path = require('path')
  , dir = process.argv.splice(2)[0] || __dirname

var urls = [
  'https://npmjs.org/static/npm.png'
, 'http://nodejs.org/images/logos/nodejs-1024x768.png'
]

es.readArray(urls)
  .pipe(tubule(dir))
  .pipe(cop(function (filename) { return filename + '\n' }))
  .pipe(process.stdout)
