# key-cache

[English documents](./README.md)

以key的形式储存数据到文件内

---

[![npm version](https://badge.fury.io/js/key-cache.svg)](https://badge.fury.io/js/key-cache) [![Build Status](https://travis-ci.org/xuexb/key-cache.svg?branch=master)](https://travis-ci.org/xuexb/key-cache) [![Coverage Status](https://coveralls.io/repos/xuexb/key-cache/badge.svg?branch=master&service=github)](https://coveralls.io/github/xuexb/key-cache?branch=master)

## 安装

> 依赖 `node 0.10+`

```bash
npm install key-cache --save
```

## 使用

```js
// 创建一个引用
var Key_cache = require('key-cache');

// 实例化对象
var cache = new Key_cache(options);

// 这里就可以使用接口来操作了
cache.get('balbalbal');
```

## 默认参数

### options.dir

数据缓存的目录，基于当前运行的目录

```js
/**
 * @default key-cache安装目录的.cache目录
 * @type {String}
 */
```

### options.timeout

缓存保存时间，单位`秒`，如果为空则永久保存

```js
/**
 * @default null
 * @type {number|null}
 */
```

## 接口

### set

写入数据到缓存文件内

```js
/**
 * @param {string} key
 * @param {Object|string} value
 * @param {Object|undefined} options        如果有则会覆盖实例参数
 * @return {Object} this
 */
set(key, value, options = {})
```

### get

从缓存文件内获取数据

```js
/**
 * @param  {string} key
 *
 * @return {Object|string|null}             如果该数据不存在或者过期则返回null
 */
get(key)
```

### remove

删除缓存数据和缓存文件

```js
/**
 * @param  {string|undefined} key
 *
 * @return {Object}     this
 */
remove(key)
```

## 例子

### 简单

```js
var cache = new Key_cache();

cache.set('name', 'key-cache');

console.log(cache.get('name'));

cache.remove('name');

console.log(cache.get('name')); // => null
```

### 自定义缓存目录

```js
var cache = new Key_cache({
    dir: '../cache/'
});

cache.set('name', 'key-cache');

// 这里参数会覆盖上面配置dir
cache.set('name2', 'key-cache', {
    dir: './cache2'
});
```

### 设置过期时间

```js
var cache = new Key_cache({
    timeout: 3
});

cache.set('name', 'key-cache');

// 这里参数会覆盖上面配置timeout
cache.set('age', 1, {
    timeout: 5
});

setTimeout(function(){
    console.log(cache.get('name')); // => null
    console.log(cache.get('age')); // => 1
}, 3000);
```

### 删除缓存

```js
var cache = new Key_cache();

cache.set('name', 'key-cache');
cache.set('age', 1);

// 删除单个
cache.remove('name');

console.log(cache.get('name')); // => null
console.log(cache.get('age')); // => 1

// 删除全部
cache.remove();

console.log(cache.get('age')); // => null
```

## 参与开发

```js
// 运行编译，将es6代码从 src 编译到 lib 目录
npm run compile

// 监听文件改动并实时编译
npm run watch

// 使用fecs检查代码规范
npm run check

// 使用 mocha 运行测试用例
npm run test

// 运行测试用例和代码覆盖率
npm run test-cov
```

## 协议

MIT