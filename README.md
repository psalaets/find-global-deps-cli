# find-global-deps-cli

CLI wrapper around [find-global-deps](https://www.npmjs.com/package/find-global-deps).

## Install

Global install to use anywhere

`npm install find-global-deps-cli -g`

Local install to use in one project's package.json `scripts` block

`npm install find-global-deps-cli -D`

## Usage

Important: This exposes an executable called `find-global-deps`, which is different than this module's name.

```
  Usage: find-global-deps [options] <pattern...>

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -e, --env <environment>  environment specifier (can pass multiple: -e es6 -e node)
    -v, --verbose            print all files, even ones with no global deps
```

`pattern` is one or more [gulp-style](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options) glob patterns. Any file matching the patterns will be checked. May need to wrap these in quotes to prevent shell from expanding them out.

Use one or more `-e <env>` to override [default environment](https://github.com/psalaets/find-global-deps#optionsenvironment) option of `find-global-deps`.

## License

MIT
