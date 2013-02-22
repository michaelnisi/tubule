
// boros - test boros

var test = require('tap').test
  , request = require('request')
  , http = require('http')
  , st = require('st')
  , es = require('event-stream')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , url = require('url')
  , mount = st('.')
  , port = '1337'
  , boros = require('../')
  , dir = '/tmp/boros-' + Math.floor(Math.random() * (1<<24))

test('setup', function (t) {
  http.createServer(function (q, s) {
    if (mount(q, s)) return
    s.statusCode = 404
    s.end('not found')
  }).listen(port)

  fs.mkdirSync(dir, 0700)
  process.chdir(dir)
  t.end()
})

test('begin', function (t) {
  var urls = [
    'http://localhost:1337/nodejs-1024x768.png'
  ]

  es.readArray(urls)
    .pipe(boros(dir))
    .pipe(es.writeArray(function (err, paths) {
      t.equal(paths.length, urls.length)
      t.end()     
    }))
})

test('teardown', function (t) {
  rimraf(dir, function (err) {
    fs.stat(dir, function (err) {
      t.ok(!!err, 'should error')
      t.end()
    })
  })
  
  process.exit()
})
