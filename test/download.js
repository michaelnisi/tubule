var test = require('tap').test
  , Readable = require('stream').Readable
  , Writable = require('stream').Writable
  , http = require('http')
  , path = require('path')
  , st = require('st')
  , rimraf = require('rimraf')
  , fs = require('fs')
  , url = require('url')
  , port = '1337'
  , tubule = require('../')
  , dir = '/tmp/tubule-' + Math.floor(Math.random() * (1<<24))
  , source = path.join(dir, 'source')
  , target = path.join(dir, 'target')

function mkdirs (dirs) {
  fs.mkdirSync(dirs.shift())
  if (dirs.length) mkdirs(dirs)
}

function writeFiles (files) {
  var file = files.shift()
  fs.writeFileSync(file.name, file.data)
  if (files.length) writeFiles(files)
}

function files (names, data) {
  var files = []
    , datum = null

  names.forEach(function (name, index) {
    datum = data[index]
    files.push({ name:name, data:datum })
  })

  return files
}

test('setup', function (t) {
  mkdirs([dir, source, target])

  var filenames = [
    path.join(source, 'a.js')
  , path.join(source, 'b.js')
  , path.join(source, 'c.js')
  ]

  writeFiles(files(filenames, [
    'console.log("A loves you!")'
  , 'console.log("B loves you!")'
  , 'console.log("C loves you!")'
  ]))

  filenames.forEach(function (filename) {
    fs.stat(filename, function (err) {
      t.ok(!err, 'should be written')
    })
  })

  var mount = st(source)

  http.createServer(function (q, s) {
    if (mount(q, s)) return
    s.statusCode = 404
    s.end('not found')
  }).listen(port)

  t.end()
})

test('optimum', function (t) {
  var urls = []
    , expected = []
    , actual = []


  var filenames = [
    'a.js'
  , 'b.js'
  , 'c.js'
  ]

  filenames.forEach(function (filename) {
    urls.push('http://localhost:1337/' + filename)
    expected.push(path.join(target, filename))
  })

  var reader = new Readable()
    , writer = new Writable()

  reader._read = function () {
    reader.push(urls.shift())
  }

  writer._write = function (chunk, enc, cb) {
    actual.push(chunk.toString())
    cb()
  }

  reader
    .pipe(tubule(target))
    .pipe(writer)
    .on('finish', function () {
      t.equal(actual.length, 3)
      expected.forEach(function (a) {
        t.ok(fs.statSync(a).isFile(), 'should be downloaded')
        t.ok(actual.some(function (b) {
          return a === b
        }), 'should contain expected path')
      })

      t.end()
    })
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
