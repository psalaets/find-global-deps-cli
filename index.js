var findGlobalDeps = require('find-global-deps');
var vfs = require('vinyl-fs');
var through2 = require('through2');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var path = require('path');

module.exports = run;

function run() {
  readInput(process.argv)
    .pipe(find())
    .on('error', function(error) {
      console.log(error);
    })
    .pipe(format())
    .pipe(process.stdout);
}

function readInput(argv) {
  if (argv.length > 2) {
    return vfs.src(argv.slice(2), {base: process.cwd()});
  } else {
    return process.stdin
      .pipe(source('<stdin>'))
      .pipe(buffer());
  }
}

function find() {
  return through2.obj(function findTransform(file, encoding, callback) {
    try {
      var result = {
        globals: findGlobalDeps(file.contents.toString()),
        file
      };

      return callback(null, result);
    } catch (e) {
      return callback(e);
    }
  });
}

function format() {
  return through2.obj(function formatTransform(result, encoding, callback) {
    var file = result.file;
    var base = path.normalize(file.base + '/');

    var fileOutput = file.path.slice(base.length);
    var globalsOutput = [...result.globals].sort().join(', ');

    var output = `File: ${fileOutput}
Globals: ${globalsOutput}
`;

    return callback(null, output);
  });
}
