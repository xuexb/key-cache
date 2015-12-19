# key-cache

In the form of key stored in the file

---

[![npm version](https://badge.fury.io/js/key-cache.svg)](https://badge.fury.io/js/key-cache) [![Build Status](https://travis-ci.org/xuexb/key-cache.svg?branch=master)](https://travis-ci.org/xuexb/key-cache) [![Coverage Status](https://coveralls.io/repos/xuexb/key-cache/badge.svg?branch=master&service=github)](https://coveralls.io/github/xuexb/key-cache?branch=master)

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


### dir

```js
/**
 * Cache directory path based on the current run directory
 *
 * @default key-cache installation path of .cache/ directory
 * @type {String}
 */
```

#### timeout

```js
/**
 * Save time, in seconds, if empty will always exist
 *
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