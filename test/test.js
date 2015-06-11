var app = require(__dirname + '/../app')
var assert = require('assert')

var folderAmountRand = 20
var fileAmountRand = 10
var fileSizeRand = 10000000
var fs = require('fs')

var amountDeleted = 0
var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        amountDeleted++
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}
var fileNames = []

describe('Check Transaction from raw data', function () {
  this.timeout(0)
  before(function (done) {
    var m = Math.floor(Math.random() * folderAmountRand)
    var data = __dirname + '/data'
    var jump = false
    var newFolder = true
    fs.mkdirSync(data)
    for (var i = 0; i < m; i++) {
      var n = Math.floor(Math.random() * fileAmountRand)
      if (Math.random() > 0.5) {
        data = data + '/data' + i
        jump = true
        newFolder = true
        fs.mkdirSync(data)
      }
      var fileNamesTemp = []
      for (var j = 0; j < n && newFolder; j++) {
        var size = Math.floor(Math.random() * (fileSizeRand - 1) + 1)
        var fileName = (Math.random() * 10).toFixed(0)
        if (fileNamesTemp.indexOf(fileName) === -1) {
          fileNamesTemp.push(fileName)
          fileNames.push(fileName)
          // console.log(fileName, data)
          fs.writeFileSync(data + '/' + fileName + '.tmp', new Buffer(size), 0, size - 1)
        }
      }
      if (jump && Math.random() > 0.5) {
        data = data.slice(0, data.lastIndexOf('/data'))
        jump = false
      }
      newFolder = false
    }
    done()
  })

  it('should order files by file name', function (done) {
    var sortingFunction = function (fileObject) {
      return fileObject.fileName
    }
    app(__dirname + '/data', [], sortingFunction, function (err, list) {
      if (err) throw err
      // console.log(fileNames)
      // console.log('Amount of Files Created: ' + fileNames.length)
      // console.log('Amount of Files In result: ' + list.length)
      fileNames = []
      for (var fileObj in list) {
        if (list[fileObj + 1]) {
          assert(list[fileObj].fileName < list[fileObj + 1].fileName, 'Should be ascending order')
        }
        fileNames.push(list[fileObj].fileName)
      }
      // console.log(fileNames)
      done()
    })
  })

  it('should order by file size', function (done) {
    var sortingFunction = function (fileObject) {
      return fileObject.fileStats.size
    }
    app(__dirname + '/data', [], sortingFunction, function (err, list) {
      if (err) throw err
      // console.log(fileNames)
      // console.log('Amount of Files Created: ' + fileNames.length)
      // console.log('Amount of Files In result: ' + list.length)
      fileNames = []
      for (var fileObj in list) {
        if (list[fileObj + 1]) {
          assert(list[fileObj].fileStats.size < list[fileObj + 1].fileStats.size, 'Should be ascending order')
        }
        fileNames.push(list[fileObj].fileName)
      }
      // console.log(fileNames)
      done()
    })
  })

  it('should returned an unordered file list', function (done) {
    app(__dirname + '/data', [], null, function (err, list) {
      if (err) throw err
      // console.log(list)
      done()
    })
  })

  after(function (done) {
    deleteFolderRecursive(__dirname + '/data')
    // console.log('Amount of Files cleared: ' + amountDeleted)
  })
})
