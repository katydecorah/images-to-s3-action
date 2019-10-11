var util = require('util');

module.exports = fastErrorFactory;

function fastErrorFactory(name, defaults) {
  function FastError() {
    this.name = name;

    if (arguments[0] && arguments[0] instanceof Error) {
      this.message = arguments[0].message;
      this.stack = arguments[0].stack.replace(arguments[0].name, name);
    } else {
      this.message = util.format.apply(null, arguments);
      Error.captureStackTrace(this, arguments.callee);
    }
  }

  FastError.prototype = Object.create(Error.prototype, {
    constructor: { value: FastError }
  });

  if (typeof defaults === 'string' || typeof defaults === 'number') {
    FastError.prototype.code = defaults
  } else if (typeof defaults === 'object') {
    for (var key in defaults) {
      FastError.prototype[key] = defaults[key];
    }
  }

  return FastError;
}
