# key-cache

[中文文档](./README-CN.md)

Storing data in the form of key into the file

---

[![NPM Version](https://img.shields.io/npm/v/key-cache.svg)](https://npmjs.org/package/key-cache)
[![NPM Downloads](https://img.shields.io/npm/dm/key-cache.svg)](https://npmjs.org/package/key-cache)
[![Linux Build](https://img.shields.io/travis/xuexb/key-cache/master.svg?label=linux)](https://travis-ci.org/xuexb/key-cache)
[![Windows Build](https://img.shields.io/appveyor/ci/xuexb/key-cache/master.svg?label=windows)](https://ci.appveyor.com/project/xuexb/key-cache)
[![Test Coverage](https://img.shields.io/coveralls/xuexb/key-cache/master.svg)](https://coveralls.io/r/xuexb/key-cache?branch=master)

## Install

> requires node 0.10+

```bash
npm install key-cache --save
```

## Use

```js
// Create reference
var Key_cache = require('key-cache');

// Examples of objects
var cache = new Key_cache(options);

// Here you can use to manipulate the cache api
cache.get('balbalbal');
```

## The default configuration

### options.dir

Cache directory path based on the current run directory

```js
/**
 * @default key-cache installation path of .cache/ directory
 * @type {String}
 */
```

### options.timeout

Save time, in seconds, if empty will always exist

```js
/**
 * @default null
 * @type {number|null}
 */
```

## Api

### set

Write data to a file

```js
/**
 * @param {string} key
 * @param {Object|string} value
 * @param {Object|undefined} options        If there will override the default configuration
 * @return {Object} this
 */
set(key, value, options = {})
```

### get

Get data from files

```js
/**
 * @param  {string} key
 *
 * @return {Object|string|null}             If there is no time has expired or will return null
 */
get(key)
```

### remove

Delete data, and delete files

```js
/**
 * @param  {string|undefined} key
 *
 * @return {Object}     this
 */
remove(key)
```

## Examples

### Simple

```js
var cache = new Key_cache();

cache.set('name', 'key-cache');

console.log(cache.get('name'));

cache.remove('name');

console.log(cache.get('name')); // => null
```

### Custom cache directory

```js
var cache = new Key_cache({
    dir: '../cache/'
});

cache.set('name', 'key-cache');

// override the default configuration
cache.set('name2', 'key-cache', {
    dir: './cache2'
});
```

### Set the expiration time

```js
var cache = new Key_cache({
    timeout: 3
});

cache.set('name', 'key-cache');

// override the default configuration
cache.set('age', 1, {
    timeout: 5
});

setTimeout(function(){
    console.log(cache.get('name')); // => null
    console.log(cache.get('age')); // => 1
}, 3000);
```

### Delete Cache

```js
var cache = new Key_cache();

cache.set('name', 'key-cache');
cache.set('age', 1);

// Delete single
cache.remove('name');

console.log(cache.get('name')); // => null
console.log(cache.get('age')); // => 1

// Delete all
cache.remove();

console.log(cache.get('age')); // => null
```

## Develop

```js
// Run the compiler, the es6 code from the compiled into lib in src
npm run compile

// Monitor file changes and runs the compiler
npm run watch

// Use fecs run Style Checker
npm run check

// Use mocha run the test case
npm run test

// Run the test cases and code coverage
npm run test-cov
```

## License

MIT