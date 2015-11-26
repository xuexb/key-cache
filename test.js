/**
 * @file 测试
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var Key_cache = require('./');

var cache = new Key_cache();

cache.set('name', 'key-cache');

console.log(cache.get('name'));