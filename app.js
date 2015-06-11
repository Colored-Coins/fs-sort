var fs = require('fs')
var p = require('path')
var minimatch = require('minimatch')

function finish (fileList, callback) {
  // console.log('Amount inside: ', fileList.length)
  var orderedFiles = fileList.sort(function compare (a, b) {
    if (a.mainAttribute < b.mainAttribute) return -1
    if (a.mainAttribute > b.mainAttribute) return 1
    return 0
  })
  callback(null, orderedFiles)
}

function fs_sort (path, ignores, sortingFunction, callback) {
  var list = []

  fs.readdir(path, function (err, files) {
    if (err) return callback(err)

    var pending = files.length
    if (!pending) {
      return finish(list, callback)
    }

    var ignoreOpts = {matchBase: true}
    files.forEach(function (file) {
      for (var i = 0; i < ignores.length; i++) {
        if (minimatch(p.join(path, file), ignores[i], ignoreOpts)) {
          pending -= 1
          if (pending <= 0) {
            finish(list, callback)
          }
          return
        }
      }

      fs.lstat(p.join(path, file), function (err, stats) {
        if (err) return callback(err)
        if (stats.isDirectory()) {
          files = fs_sort(p.join(path, file), ignores, sortingFunction, function (err, res) {
            if (err) callback(err)
            list = list.concat(res)
            pending -= 1
            if (!pending) {
              finish(list, callback)
            }
          })
        } else {
          var fileFullPath = p.join(path, file)
          var fileObj = {fileName: file, fileStats: stats, fileFullPath: fileFullPath}
          fileObj.mainAttribute = (typeof sortingFunction === 'function') && sortingFunction(fileObj) || ''
          list.push(fileObj)
          pending -= 1
          if (!pending) {
            finish(list, callback)
          }
        }
      })
    })
  })
}

module.exports = fs_sort
