var test = require('tape');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var path = require('path');

function fixture(fixtureFilename) {
  return path.resolve(__dirname, fixtureFilename);
}

function bin() {
  return path.resolve(__dirname, '../bin/find-global-deps');
}

test('single file via command line args', function(t) {
  t.plan(1);

  var child = spawn(bin(), [fixture('fixture-a.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), 'File: test/fixture-a.js\nGlobals: a\n');
    }));
});

test('multiple files via command line args', function(t) {
  t.plan(1);

  var expected = 'File: test/fixture-a.js\nGlobals: a\n' +
    'File: test/fixture-b.js\nGlobals: b, bb\n';

  var child = spawn(bin(), [fixture('fixture-a.js'), fixture('fixture-b.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('quoted glob', function(t) {
  t.plan(1);

  var expected = 'File: test/fixture-a.js\nGlobals: a\n' +
    'File: test/fixture-b.js\nGlobals: b, bb\n';

  var child = spawn(bin(), ['**/fixture-*.js']);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('stdin', function(t) {
  t.plan(1);

  var child = spawn(bin(), []);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), 'File: <stdin>\nGlobals: foo\n');
    }));

  child.stdin.end('foo');
});

test('ignores stdin if any files were on command line', function(t) {
  t.plan(1);

  var child = spawn(bin(), [fixture('fixture-a.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), 'File: test/fixture-a.js\nGlobals: a\n');
    }));

  child.stdin.end('foo');
});