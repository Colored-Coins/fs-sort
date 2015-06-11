# fs-sort
[![Build Status](https://travis-ci.org/Colored-Coins/fs-sort.svg?branch=master)](https://travis-ci.org/Colored-Coins/fs-sort) [![Coverage Status](https://coveralls.io/repos/Colored-Coins/fs-sort/badge.svg?branch=master)](https://coveralls.io/r/Colored-Coins/fs-sort?branch=master) [![npm version](https://badge.fury.io/js/fs-sort.svg)](http://badge.fury.io/js/fs-sort)

fs-sort recursivly finds all files in path and create a list of all of those files orderded by the filter function provided

### Installation

```sh
$ npm i fs-sort
```


### Get sorted files

Params:

  - path - Path to get files from
  - ignores - Array of file names to ignore
  - sortingFunction - The function that "chooses" what file property to use for sorting. sortingFunction receive the parameter fileObject which is in the form of:

```js
{
  fileName: "Name of the file, including the extension",
  fileStats: "File stats that dependes on the version of node you are running and the OS",
  fileFullPath: "Full file path to system root folder"
}
```

  - callback - A callback in the form of function(err, orderedFileList)

##### Example:

```js
var fs_sort = require('fs-sort')

var sortingFunction = function (fileObject) {
  return fileObject.fileName
}

fs_sort('/data', [], sortingFunction, function (err, list) {
  if (err) throw err
  for (var file in list) {
    console.log(list[file])
    // Will print something like this:
    // {
    //  fileName: '8.tmp',
    //  fileStats:
    //  {
    //    dev: 16777220,
    //    mode: 33188,
    //    nlink: 1,
    //    uid: 502,
    //    gid: 20,
    //    rdev: 0,
    //    blksize: 4096,
    //    ino: 21894243,
    //    size: 8230522,
    //    blocks: 16080,
    //    atime: Thu Jun 11 2015 03:27:26 GMT+0300 (IDT),
    //    mtime: Thu Jun 11 2015 03:27:26 GMT+0300 (IDT),
    //    ctime: Thu Jun 11 2015 03:27:26 GMT+0300 (IDT)
    //   },
    //   fileFullPath: '/Users/username/folder/data/8.tmp',
    //   mainAttribute: '8.tmp'
    // }
  }
})
```


### Testing

In order to test you need to install [mocha] globaly on your machine

```sh
$ cd /"module-path"/fs-sort
$ mocha
```


License
----

MIT

[mocha]:https://www.npmjs.com/package/mocha