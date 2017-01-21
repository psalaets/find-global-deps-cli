var findGlobalDeps = require('find-global-deps');
var vfs = require('vinyl-fs');
var through2 = require('through2');
var path = require('path');

module.exports = run;

function run({environment, patterns}) {
  readInput(patterns)
    .pipe(find(environment))
    .on('error', function(error) {
      console.error(error);
    })
    .pipe(format())
    .pipe(process.stdout);
}

function readInput(patterns) {
  return vfs.src(patterns, {base: process.cwd()});
}

function find(environment) {
  return through2.obj(function findTransform(file, encoding, callback) {
    try {
      var result = {
        globals: findGlobalDeps(file.contents.toString(), {
          environment
        }),
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
