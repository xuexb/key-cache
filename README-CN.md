# key-cache

[English documents](./README.md)

以`key`的形式储存数据到文件内

---

[![NPM Version](https://img.shields.io/npm/v/key-cache.svg)](https://npmjs.org/package/key-cache)
[![NPM Downloads](https://img.shields.io/npm/dm/key-cache.svg)](https://npmjs.org/package/key-cache)
[![Linux Build](https://img.shields.io/travis/xuexb/key-cache/master.svg?label=linux)](https://travis-ci.org/xuexb/key-cache)
[![Windows Build](https://img.shields.io/appveyor/ci/xuexb/key-cache/master.svg?label=windows)](https://ci.appveyor.com/project/xuexb/key-cache)
[![Test Coverage](https://img.shields.io/coveralls/xuexb/key-cache/master.svg)](https://coveralls.io/r/xuexb/key-cache?branch=master)

## 安装

> 依赖 `node 0.12+`

```bash
npm install key-cache --save
```

## 使用

```js
// 创建一个引用
var KeyCache = require('key-cache');

// 实例化对象
var cache = new KeyCache(options);

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

### options.md5key

设置是否使用`md5`命名缓存文件名，为了路径的有效性，会过滤除了中文、字母、数字、-、_ 外的其他字符将被忽略，使用的正则是：`/[^\u4e00-\u9fa5a-zA-Z\_\-0-9]/g`.

```js
/**
 * @default true
 * @type {Boolean}
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
var cache = new KeyCache();

cache.set('name', 'key-cache');

console.log(cache.get('name'));

cache.remove('name');

console.log(cache.get('name')); // => null
```

### 自定义缓存目录

```js
var cache = new KeyCache({
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
var cache = new KeyCache({
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
var cache = new KeyCache();

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


### md5key配置

> 配置不使用`md5`为缓存文件名

```js
var cache = new KeyCache({
    md5key: false
});

cache.set('key', 'key-cache'); // => 文件名是 key.json
cache.set('age', 1); // => 文件名是 age.json
cache.set('this a space +-', 1); // => 文件名是 thisaspace-.json
cache.set('中文', 1); // => filename is 中文.json
```


## 参与开发

> 使用es6开发，依赖[babel 6.x](https://babeljs.io/)编译

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

## 更新日志

### 0.2.6

升级为[babel 6.x](https://babeljs.io/)编译

### 0.2.3

* 修改 `precommit` 为 `prepush`
* 添加 [release.sh](release.sh), 来自 [vue](https://github.com/vuejs/vue/blob/dev/build/release.sh)

### 0.2.1

修复当参数为`function`时返回值的类型，从`undefined`改成`null`~

### 0.2.0

添加`options.md5key`参数，用来配置是否使用`md5`方式命名缓存文件名

### 0.1.x

优化代码，添加测试用例

## 协议

MIT