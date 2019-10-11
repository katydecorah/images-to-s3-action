var fasterror = require('../index');
var test = require('tape');

test('[error factory] should make an error constructor', function(assert) {
    var MyError = fasterror('MyError', { code: 'code' });
    assert.equal(typeof MyError, 'function');
    assert.end();
});


test('[error constructor] should make a error object that works with instanceof and typeof', function(assert) {
    var MyError = fasterror('MyError', { code: 'code' });
    var err = new MyError();
    assert.ok(err instanceof MyError);
    assert.ok(err instanceof Error);
    assert.equal(typeof err, 'object');
    assert.end();
});
test('[error constructor] should set .name and .message properly', function(assert) {
    var MyError = fasterror('MyError', { code: 'code' });
    var err = new MyError('test');
    assert.equal(err.name, 'MyError');
    assert.equal(err.message, 'test');
    assert.end();
});
test('[error constructor] should set default properties from second argument if it is an object', function(assert) {
    var MyError = fasterror('MyError', {code: 123, foo: 'bar'});
    var err = new MyError();
    assert.equal(err.code, 123);
    assert.equal(err.foo, 'bar');
    assert.end();
});
test('[error constructor] should set default code if second argument is a string', function(assert) {
    var MyError = fasterror('MyError', 'ENOENT');
    var err = new MyError();
    assert.equal(err.code, 'ENOENT');
    assert.end();
});
test('[error constructor] should set default code if second argument is a number', function(assert) {
    var MyError = fasterror('MyError', 123);
    var err = new MyError();
    assert.equal(err.code, 123);
    assert.end();
});
test('[error constructor] should copy message and stack from constructing error', function(assert) {
    var MyError = fasterror('MyError');
    var sourceErr = new TypeError('bad type');
    var err = new MyError(sourceErr);
    assert.equal(err.message, 'bad type');
    assert.ok(err.stack.match(/^MyError: bad type/));
    // Is set to 47:21 to indicate it came from the `TypeError` line
    assert.ok(err.stack.match(/error.test.js:47:21/));
    assert.end();
});
test('[error constructor] should set default code for constructing error', function(assert) {
    var MyError = fasterror('MyError', {code: 'code'});
    var sourceErr = new TypeError('bad type');
    var err = new MyError(sourceErr);
    assert.equal(err.message, 'bad type');
    assert.equal(err.code, 'code');
    assert.end();
});

test('[error object] should perform string interpolation on provided arguments', function(assert) {
    var MyError = fasterror('MyError');
    var err = new MyError('%s, %j', 'bacon', { lettuce: true, tomato: true });
    assert.equal(err.message, 'bacon, {"lettuce":true,"tomato":true}');
    assert.end();
});

test('[error object] should merge with defaults from constructor', function(assert) {
    var MyError = fasterror('MyError', {code: 123, foo: 'bar'});
    var err = new MyError('test');
    assert.equal(err.code, 123);
    assert.equal(err.foo, 'bar');
    assert.end();
});
