/**
 * @file 测试用例
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var Key_cache = require('../');
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var extra = require('fs-extra');

describe('key-cache', function () {
    var cache = new Key_cache();

    afterEach(function () {
        cache.remove();
    });

    it('new', function () {
        try {
            var key_cache = Key_cache;
            key_cache();
            assert.strictEqual(true, false);
        }
        catch (e) {
            assert.strictEqual(true, true);
        }
    });

    // 判断只要写入文件就算成功
    it('options.dir', function () {
        var filepath = './test/temp/.' + Date.now();
        var cache2 = new Key_cache({
            dir: filepath
        });

        // 写入文件
        cache2.set('test', 1);

        // 目录必须存在，并且里面文件必须有1个
        assert.strictEqual(true, fs.existsSync(filepath) && fs.readdirSync(filepath).length === 1);

        // 删除目录
        extra.removeSync('./test/temp');
    });

    it('options.timeout', function (done) {
        var cache2 = new Key_cache({
            timeout: 1
        });

        cache2.set('test', 1);

        assert.strictEqual(1, cache2.get('test'));

        // 过期时间为1m，但执行会有延迟的
        setTimeout(function () {
            assert.strictEqual(1, cache2.get('test'));
        }, 500);

        setTimeout(function () {
            assert.strictEqual(null, cache2.get('test'));
            done();
        }, 1001);
    });

    // 判断只要写入文件就算成功
    it('set(key, value, {dir: ""})', function () {
        var filepath = './test/temp/.' + Date.now();

        // 写入文件
        cache.set('test', 1, {
            dir: filepath
        });

        // 目录必须存在，并且里面文件必须有1个
        assert.strictEqual(true, fs.existsSync(filepath) && fs.readdirSync(filepath).length === 1);

        // 删除目录
        extra.removeSync('./test/temp');
    });

    it('set(key, value, {timeout: ""})', function (done) {
        cache.set('test', 1, {
            timeout: 1
        });

        assert.strictEqual(1, cache.get('test'));

        // 过期时间为1m，但执行会有延迟的
        setTimeout(function () {
            assert.strictEqual(1, cache.get('test'));
        }, 500);

        setTimeout(function () {
            assert.strictEqual(null, cache.get('test'));
            done();
        }, 1001);
    });

    it('get json parse error', function () {
        var cache = new Key_cache();

        // 重写获取路径
        cache._get_filepath = function () {
            return path.resolve(__dirname, './json/', 'parse-error.json');
        };

        assert.strictEqual(null, cache.get());
    });

    it('get json error', function () {
        var cache = new Key_cache();

        // 重写获取路径
        cache._get_filepath = function () {
            return path.resolve(__dirname, './json/', 'no-time.json');
        };

        assert.strictEqual(null, cache.get());
    });

    it('过期后删除文件', function (done) {
        var filepath = './test/temp/.' + Date.now();
        var cache2 = new Key_cache({
            dir: filepath,
            timeout: 1
        });

        // 写入文件
        cache2.set('test', 1);

        setTimeout(function () {
            // 得先获取下才可以
            cache2.get('test');

            // 验证文件为空
            assert.strictEqual(0, fs.readdirSync(path.resolve(filepath)).length);

            // 删除目录
            extra.removeSync('./test/temp');
            done();
        }, 1001);
    });

    it('string格式校验', function () {
        cache.set('test', '1');

        assert.strictEqual('string', typeof cache.get('test'));
        assert.strictEqual('1', cache.get('test'));
    });

    it('number格式校验', function () {
        cache.set('test', 1);

        assert.strictEqual('number', typeof cache.get('test'));
        assert.strictEqual(1, cache.get('test'));
    });

    it('json格式判断', function () {
        var result;
        var json = {
            status: 'ok',
            code: 0,
            flag: true,
            array: [
                0
            ]
        };

        cache.set('test', json);

        result = cache.get('test');

        assert.deepEqual(json, result);

        assert.strictEqual(json.status, result.status);
        assert.strictEqual(json.code, result.code);
        assert.strictEqual(json.flag, result.flag);
        assert.deepEqual(json.array, result.array);
    });

    it('remove(key)', function () {
        cache.set('aaa', 1);

        cache.remove('aaa');

        assert.strictEqual(null, cache.get('aaa'));
    });

    it('remove()', function () {
        cache.set('aaa', 1);
        cache.set('bbb', 1);
        cache.set('ccc', 1);

        cache.remove();

        assert.strictEqual(0, fs.readdirSync(cache.options.dir).length);
    });

    it('return set()', function () {
        assert.strictEqual(cache, cache.set());
    });

    it('return set(key)', function () {
        assert.strictEqual(cache, cache.set('key'));
    });

    it('return set(key, value)', function () {
        assert.strictEqual(cache, cache.set('key', 'value'));
    });

    it('return remove()', function () {
        assert.strictEqual(cache, cache.remove());
    });

    it('return remove(key)', function () {
        assert.strictEqual(cache, cache.remove('key'));
    });

    it('return get(errkey)', function () {
        assert.strictEqual(null, cache.get('xxxxxx'));
    });
});
