
// filterURLs - filter URls

var path = require('path')

module.exports = function (url) {
  if (!url) return undefined 
  
  var ext = path.extname(url)
  if (url.substr(0, 4) === 'http' && (ext === '.png' || ext === '.jpg')) {
    return url
  }
  
  return undefined
}
