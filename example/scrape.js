var http = require('http')
  , tubule = require('../')
  , cop = require('cop')
  , scrim = require('scrim')
  , dir = '/tmp/tubule-' + Math.floor(Math.random() * (1<<24))

http.get('http://www.nodejs.org', function (res) {
  res
    .pipe(scrim())
    .on('error', console.error)
    .pipe(cop(abs))
    .pipe(tubule(dir))
    .on('error', console.error)
    .pipe(cop(function (uri) { return uri + '\n' }))
    .pipe(process.stdout)
})

function abs (uri) {
  return uri.toString().substr(0,4) === 'http' ? uri : null
}
