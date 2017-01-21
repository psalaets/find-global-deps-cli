var test = require('tape');
var spawn = require('child_process').spawn;
var concat = require('concat-stream');
var path = require('path');

function fixture(fixtureFilename) {
  return path.resolve(__dirname, 'fixtures', fixtureFilename);
}

function bin() {
  return path.resolve(__dirname, '../bin/find-global-deps');
}

test('single file via command line args', function(t) {
  t.plan(1);

  var child = spawn(bin(), [fixture('fixture-a.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), 'File: test/fixtures/fixture-a.js\nGlobals: a\n');
    }));
});

test('multiple files via command line args', function(t) {
  t.plan(1);

  var expected = 'File: test/fixtures/fixture-a.js\nGlobals: a\n' +
    'File: test/fixtures/fixture-b.js\nGlobals: b, bb\n';

  var child = spawn(bin(), [fixture('fixture-a.js'), fixture('fixture-b.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('quoted gulp-style glob', function(t) {
  t.plan(1);

  var expected = 'File: test/fixtures/fixture-a.js\nGlobals: a\n' +
    'File: test/fixtures/fixture-b.js\nGlobals: b, bb\n';

  var child = spawn(bin(), ['**/fixture-*.js']);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('writes to stderr on parse error', function(t) {
  t.plan(1);

  var child = spawn(bin(), [fixture('invalid.js')]);
  child.stderr
    .pipe(concat(function(contents) {
      t.ok(contents.toString().length > 0);
    }));
});

test('specify environment via command line args', function(t) {
  t.plan(1);

  var expected = 'File: test/fixtures/browser-commonjs.js\nGlobals: blah\n';

  var child = spawn(bin(), ['-e', 'browser', '-e', 'commonjs', fixture('browser-commonjs.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('(long param) specify environment via command line args', function(t) {
  t.plan(1);

  var expected = 'File: test/fixtures/browser-commonjs.js\nGlobals: blah\n';

  var child = spawn(bin(), ['--env', 'browser', '--env', 'commonjs', fixture('browser-commonjs.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('by default, does not print files that have no globals', function(t) {
  t.plan(1);

  var expected = '';

  var child = spawn(bin(), [fixture('no-globals.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('in verbose mode, does print files that have no globals', function(t) {
  t.plan(1);

  var expected = 'File: test/fixtures/no-globals.js\nGlobals: \n';

  var child = spawn(bin(), ['-v', fixture('no-globals.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});

test('(long param) in verbose mode, does print files that have no globals', function(t) {
  t.plan(1);

  var expected = 'File: test/fixtures/no-globals.js\nGlobals: \n';

  var child = spawn(bin(), ['--verbose', fixture('no-globals.js')]);
  child.stdout
    .pipe(concat(function(contents) {
      t.equals(contents.toString(), expected);
    }));
});
