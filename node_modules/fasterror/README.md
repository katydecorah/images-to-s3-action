fasterror
=========
Quickly create custom error objects.

[![Build Status](https://travis-ci.org/willwhite/fasterror.png?branch=master)](https://travis-ci.org/willwhite/fasterror)

```
var fasterror = require('fasterror');
var MyError = fasterror('MyError', {code: 'ENOENT'});
```

`fasterror()` is the factory for creating custom error objects. The first
argument is the name of the desired custom error object. The second is an object
containing keys that will decorate any errors created with the resulting object.

```
var username = 'jsmith';
var err = new MyError('Failed to load user %s', username);
```

Create new errors with the resulting class. The error created will perform string
interpolation on the arguments passed and set the resulting value as `err.message`.
See [node.js documentation](https://nodejs.org/docs/v0.10.40/api/util.html#util_util_format_format)
for interpolation details.
