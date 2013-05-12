# tubule - copy files from URI stream

The tubule [Node.js](http://nodejs.org/) module is a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream that uses http or https to get files from URIs written to it. While the files are copied to a local directory `tubule` emits the paths of the completed downloads.

[![Build Status](https://secure.travis-ci.org/michaelnisi/tubule.png?branch=master)](https://travis-ci.org/michaelnisi/tubule)

## Usage

To download all images from [nodejs.org](http://nodejs.org):
    
    var http = require('http')
      , tubule = require('tubule')
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

### tubule(dir)

The `tubule` module exports a single function that returns a [Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) stream.

- `dir` The target directory to write the files

## Installation

Install with [npm](https://npmjs.org):

    npm install tubule

## License

[MIT License](https://raw.github.com/michaelnisi/tubule/master/LICENSE)
