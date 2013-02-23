
// download - test downloading

var test = require('tap').test
  , request = require('request')
  , http = require('http')
  , path = require('path')
  , st = require('st')
  , es = require('event-stream')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , url = require('url')
  , mount = st('.')
  , port = '1337'
  , tubule = require('../')
  , dir = '/tmp/tubule-' + Math.floor(Math.random() * (1<<24))

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

test('optimum', function (t) {
  var urls = []
    , expected = []
  
  var filenames = [
    'nodejs-1024x768.png'
  , '800px-Joyent-logo.png'
  , 'npm-logo.png'
  ]

  filenames.forEach(function (filename) {
    urls.push('http://localhost:1337/' + filename)
    expected.push(path.join(dir, filename)) 
  })

  es.readArray(urls)
    .pipe(tubule(dir))
    .pipe(es.writeArray(function (err, paths) {
      t.equal(paths.length, urls.length)
      expected.forEach(function (a) {
        t.ok(fs.statSync(a).isFile(), 'should be downloaded')
        t.ok(paths.some(function (b) {
          return a === b
        }), 'should contain expected path')
      })
      
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
