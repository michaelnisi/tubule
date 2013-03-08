# tubule - write files from a stream of URIs

[![Build Status](https://secure.travis-ci.org/michaelnisi/tubule.png?branch=master)](https://travis-ci.org/michaelnisi/tubule)

## Description

A [through](https://github.com/dominictarr/through) stream that copies files from URIs written to it, while it emits target filenames (of completed downloads).

## Usage

    var tubule = require('tubule')
      , es = require('event-stream')
      , cop = require('cop')
      , dir = process.argv.splice(2)[0] || __dirname

    var urls = [
      'https://npmjs.org/static/npm.png'
    , 'http://nodejs.org/images/logos/nodejs-1024x768.png'
    ]

    es.readArray(urls)
      .pipe(tubule(dir))
      .pipe(cop(function (filename) { return filename + '\n' }))
      .pipe(process.stdout)

## Installation

Install with [npm](https://npmjs.org):

    npm install tubule

## License

[MIT License](https://raw.github.com/michaelnisi/tubule/master/LICENSE)
