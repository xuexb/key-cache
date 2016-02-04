/**
 * @file 测试用例
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

var KeyCache = require('../');
var assert = require('assert');
var strictEqual = assert.strictEqual;
var fs = require('fs');
var path = require('path');
var extra = require('fs-extra');

describe('key-cache', function () {
    var cache = new KeyCache();

    // 每次执行完成后清空缓存
    afterEach(function () {
        cache.remove();
    });

    it('new', function () {
        try {
            var keycache = KeyCache;
            keycache();
            strictEqual(true, false);
        }
        catch (e) {
            strictEqual(true, true);
        }
    });

    it('new KeyCache() check option', function () {
        var flag = true;

        try {
            new KeyCache({});
            new KeyCache();
            new KeyCache(false);
            new KeyCache('');
            new KeyCache(null);
            new KeyCache(0);
            new KeyCache('str');
        }
        catch (e) {
            flag = false;
        }

        strictEqual(true, flag);
    });

    it('options.md5key', function () {
        var filepath = './test/temp/.' + Date.now();
        var cache2 = new KeyCache({
            dir: filepath,
            md5key: false
        });

        var arr = [
            '中文',
            'en',
            '空格   ',
            '～！@#￥%……&*（））——',
            '~!@#$%^&*()_+',
            '{}[];"\'',
            '<>,./?\\:',
            '::::',
            '1234566'
        ];

        arr.forEach(function (val, index) {
            cache2.set(val, index);
        });

        strictEqual(true, fs.existsSync(filepath));
        strictEqual(arr.length, fs.readdirSync(filepath).length);

        arr.forEach(function (val, index) {
            strictEqual(index, cache2.get(val));
        });

        // 删除目录
        extra.removeSync('./test/temp');
    });

    // 判断只要写入文件就算成功
    it('options.dir', function () {
        var filepath = './test/temp/.' + Date.now();
        var cache2 = new KeyCache({
            dir: filepath
        });

        // 写入文件
        cache2.set('test', 1);

        // 目录必须存在，并且里面文件必须有1个
        strictEqual(true, fs.existsSync(filepath) && fs.readdirSync(filepath).length === 1);

        // 删除目录
        extra.removeSync('./test/temp');
    });

    it('options.timeout', function (done) {
        var cache2 = new KeyCache({
            timeout: 2
        });

        cache2.set('timeout', 1);

        strictEqual(1, cache2.get('timeout'));

        // 过期时间为1m，但执行会有延迟的
        setTimeout(function () {
            strictEqual(1, cache2.get('timeout'));
        }, 500);

        setTimeout(function () {
            strictEqual(null, cache2.get('timeout'));
            done();
        }, 2500);
    });

    it('get(key)', function () {
        cache.set('1', 1);
        strictEqual(1, cache.get('1'));
        strictEqual(null, cache.get(null));
    });

    it('return get(errkey)', function () {
        strictEqual(null, cache.get('xxxxxx'));
    });

    it('get json parse error', function () {
        var cache = new KeyCache();

        var filepath = path.resolve(__dirname, './notime.json');
        fs.writeFileSync(filepath, JSON.stringify({
            name: 'key-cache'
        }));

        // 重写获取路径
        cache._getFilePath = function () {
            return filepath;
        };

        strictEqual(null, cache.get());

        // 删除刚才写入的文件
        extra.removeSync(filepath);
    });

    it('get json error', function () {
        var cache = new KeyCache();

        var filepath = path.resolve(__dirname, './parseerror.json');
        fs.writeFileSync(filepath, '{');

        // 重写获取路径
        cache._getFilePath = function () {
            return filepath;
        };

        strictEqual(null, cache.get());

        // 删除刚才写入的文件
        extra.removeSync(filepath);
    });

    // 判断只要写入文件就算成功
    it('set(key, value)', function () {
        var filepath;

        // 写入文件
        cache.set('test', 1);

        strictEqual(1, cache.get('test'));

        // 使用内置方法读取出来路径
        filepath = cache._getFilePath('test');

        // 文件必须存在
        strictEqual(true, fs.existsSync(filepath));

        // 查看是否能正常的解析
        try {
            JSON.parse(fs.readFileSync(filepath).toString());
        }
        catch (e) {
            strictEqual(true, false);
        }
    });

    // 判断只要写入文件就算成功
    it('set(key, value, {dir: path})', function () {
        var filepath = './test/temp/.' + Date.now();

        // 写入文件
        cache.set('test', 1, {
            dir: filepath
        });

        // 目录必须存在，并且里面文件必须有1个
        strictEqual(true, fs.existsSync(filepath) && fs.readdirSync(filepath).length === 1);

        // 删除目录
        extra.removeSync('./test/temp');
    });

    it('set(key, value, {timeout: ""})', function (done) {
        cache.set('test', 1, {
            timeout: 1
        });

        strictEqual(1, cache.get('test'));

        // 过期时间为1m，但执行会有延迟的
        setTimeout(function () {
            strictEqual(1, cache.get('test'));
        }, 500);

        setTimeout(function () {
            strictEqual(null, cache.get('test'));
            done();
        }, 1001);
    });

    it('return set()', function () {
        strictEqual(cache, cache.set());
    });

    it('return set(key)', function () {
        strictEqual(cache, cache.set('key'));
        strictEqual(cache, cache.set(true));
        strictEqual(cache, cache.set(0));
        strictEqual(cache, cache.set(null));
    });

    it('return set(key, value)', function () {
        strictEqual(cache, cache.set('key', 'value'));
        strictEqual(cache, cache.set('key', false));
        strictEqual(cache, cache.set('key', 0));
    });

    it('remove(key)', function () {
        cache.set('aaa', 1);

        cache.remove('aaa');

        strictEqual(null, cache.get('aaa'));
    });

    it('remove()', function () {
        cache.set('aaa', 1);
        cache.set('bbb', 1);
        cache.set('ccc', 1);

        cache.remove();

        strictEqual(0, fs.readdirSync(cache.options.dir).length);
    });

    it('return remove()', function () {
        strictEqual(cache, cache.remove());
    });

    it('return remove(key)', function () {
        strictEqual(cache, cache.remove('not file'));

        cache.set('key', 1);
        strictEqual(cache, cache.remove('key'));
    });

    it('timeout remove file', function (done) {
        var filepath = './test/temp/.' + Date.now();
        var cache2 = new KeyCache({
            dir: filepath,
            timeout: 1
        });

        // 写入文件
        cache2.set('test', 1);

        setTimeout(function () {
            // 得先获取下才可以
            cache2.get('test');

            // 验证文件为空
            strictEqual(0, fs.readdirSync(path.resolve(filepath)).length);

            done();

            // 删除目录
            extra.removeSync('./test/temp');
        }, 1500);
    });

    it('string check', function () {
        cache.set('test', '1');

        strictEqual('string', typeof cache.get('test'));
        strictEqual('1', cache.get('test'));
    });

    it('boolean check', function () {
        cache.set('true', true);
        cache.set('false', false);

        strictEqual('boolean', typeof cache.get('true'));
        strictEqual(false, cache.get('false'));
        strictEqual(true, cache.get('true'));
    });

    it('number check', function () {
        cache.set('test', 1);
        cache.set('0', 0);

        strictEqual('number', typeof cache.get('test'));
        strictEqual(1, cache.get('test'));
        strictEqual(0, cache.get('0'));
    });

    it('function check', function () {
        cache.set('test', function () {});

        strictEqual(null, cache.get('test'));
    });

    it('undefined check', function () {
        var a;
        cache.set('test', a);

        strictEqual(null, cache.get('test'));
    });

    it('object check', function () {
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

        strictEqual(json.status, result.status);
        strictEqual(json.code, result.code);
        strictEqual(json.flag, result.flag);

        cache.set('null', null);
        strictEqual(null, cache.get('null'));
    });
});
