# key-cache

以key形式的cache

---

[![npm version](https://badge.fury.io/js/key-cache.svg)](https://badge.fury.io/js/key-cache) [![Build Status](https://travis-ci.org/xuexb/key-cache.svg?branch=master)](https://travis-ci.org/xuexb/key-cache) [![Coverage Status](https://coveralls.io/repos/xuexb/key-cache/badge.svg?branch=master&service=github)](https://coveralls.io/github/xuexb/key-cache?branch=master)

## Install

> 依赖`node 0.12+`

```bash
npm install key-cache --save
```

## Use

```js
var Key_cache = require('key-cache');

var cache = new Key_cache(options);

cache.set(key, val, [options]);

cache.get(key);

cache.remove([key]);
```

## Options

> 默认配置

```js
{
    /**
     * 缓存目录，路径基于当前运行目录
     *
     * @default 安装包里 dirname + .cache
     * @type {String}
     */
    dir: resolve(__dirname, '..', '.cache'),

    /**
     * 保存的时间，单位秒，如果是null则表示一直保存
     *
     * @default null
     * @type {Number|null}
     */
    timeout: null
}
```

## Api

### set

```js
/**
 * 设置缓存
 *
 * @param {string} key   key
 * @param {Object|string} value 值
 * @param {Object|undefined} options 可选配置
 * @return {Object} this
 */
set(key, value, options = {})
```

### get

```js
/**
 * 获取缓存
 *
 * @param  {string} key key
 *
 * @return {Object|string|null}     结果，如果没有找到或者过期则为null
 */
get(key)
```

### remove

```js
/**
 * 删除缓存
 *
 * @param  {string|undefined} key key，如果为空则全部删除
 *
 * @return {Object}     this
 */
remove(key)
```

## Demo

### 默认

```js
var cache = new Key_cache();

cache.set('name', 'key-cache');

console.log(cache.get('name'));

cache.remove('name');

console.log(cache.get('name'));// => null
```

### 设置缓存目录

```js
var cache = new Key_cache({
    // 相对于当前运行目录
    dir: './cache/'
});

cache.set('name', 'key-cache');

// 传的配置参数会覆盖实例的参数
cache.set('name2', 'key-cache', {
    dir: './cache2'
});
```

### 设置过期时间

```js
var cache = new Key_cache({
    // 单位秒
    timeout: 3
});

cache.set('name', 'key-cache');

// 传的配置参数会覆盖实例的参数
cache.set('age', 1, {
    timeout: 5
});

setTimeout(function(){
    console.log(cache.get('name'));// => null
    console.log(cache.get('age'));// => 1
}, 3000);
```

### 删除缓存

```js
var cache = new Key_cache();

cache.set('name', 'key-cache');
cache.set('age', 1);

// 删除单条
cache.remove('name');

console.log(cache.get('name'));// => null
console.log(cache.get('age'));// => 1

// 删除全部
cache.remove();

console.log(cache.get('age'));// => null
```

## License

MIT