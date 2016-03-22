/**
 * @file 测试用例
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

import should from 'should';
import {existsSync, readFileSync, writeFileSync, readdirSync} from 'fs';
import {removeSync, mkdirpSync} from 'fs-extra';
import {resolve, dirname} from 'path';

import KeyCache from '../src/main';
import types from './types';

describe('key-cache', () => {
    let cache = new KeyCache();

    // 每次执行完成后清空缓存
    afterEach(() => {
        cache.remove();
        removeSync('./test/temp');
    });

    it('new', () => {
        should.throws(
            () => {
                let keyCache = KeyCache;
                keyCache();
            }
        );
    });

    it('new KeyCache() check option', () => {
        should.doesNotThrow(() => {
            types.forEach(key => new KeyCache(key));
        }, 'option type error');
    });

    it('options.md5key', () => {
        let filepath = './test/temp/.' + Date.now();
        let cache2 = new KeyCache({
            dir: filepath,
            md5key: false
        });

        let arr = [
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

        // 设置值
        arr.forEach((val, index) => {
            cache2.set(val, index);
        });

        // 验证目录是否存在
        existsSync(filepath).should.be.true();

        // 目录里的文件必须是数组的长度
        readdirSync(filepath).length.should.equal(arr.length);

        // 验证获取
        arr.forEach((val, index) => {
            index.should.equal(cache2.get(val));
        });
    });

    // 判断只要写入文件就算成功
    it('options.dir', () => {
        let filepath = './test/temp/.' + Date.now();
        let cache2 = new KeyCache({
            dir: filepath
        });

        // 写入文件
        cache2.set('test', 1);

        // 必须目录存在
        existsSync(filepath).should.be.true();

        // 必须有1个文件
        readdirSync(filepath).length.should.equal(1);
    });

    it('options.timeout', done => {
        let cache2 = new KeyCache({
            timeout: 1
        });

        cache2.set('timeout', 1);

        cache2.get('timeout').should.equal(1);

        setTimeout(() => {
            cache2.get('timeout').should.equal(1);
        }, 100);

        setTimeout(() => {
            (cache2.get('timeout') === null).should.be.true();
            done();
        }, 1500);
    });

    it('get(key)', () => {
        cache.set('get(key)', 1);
        cache.get('get(key)').should.equal(1);

        types.forEach(key => {
            (cache.get(key) === null).should.be.true();
        });
    });

    it('get json parse error', () => {
        let cache = new KeyCache();

        let filepath = resolve(__dirname, './temp/notime.json');

        mkdirpSync(dirname(filepath));

        // 写个假的
        writeFileSync(filepath, JSON.stringify({
            name: 'key-cache'
        }));

        // 重写获取路径
        cache._getFilePath = () => filepath;

        (cache.get() === null).should.be.true();
    });

    it('get json error', () => {
        let cache = new KeyCache();
        let filepath = resolve('./test/temp/parseerror.json');

        mkdirpSync(dirname(filepath));

        // 写入错误文件
        writeFileSync(filepath, '{');

        // 重写获取路径
        cache._getFilePath = () => filepath;

        (cache.get() === null).should.be.true();
    });

    // 判断只要写入文件就算成功
    it('set(key, value)', () => {
        let filepath;

        // 写入文件
        cache.set('test', 1);

        cache.get('test').should.equal(1);

        // 使用内置方法读取出来路径
        filepath = cache._getFilePath('test');

        // 文件必须存在
        existsSync(filepath).should.be.true();

        // 查看是否能正常的解析
        should.doesNotThrow(() => {
            JSON.parse(readFileSync(filepath).toString());
        }, 'parse json file error');
    });

    // 判断只要写入文件就算成功
    it('set(key, value, {dir: path})', () => {
        let filepath = './test/temp/.' + Date.now();

        // 写入文件
        cache.set('test', 1, {
            dir: filepath
        });

        // 目录必须存在，并且里面文件必须有1个
        existsSync(filepath).should.be.true();
        readdirSync(filepath).length.should.equal(1);
    });

    it('set(key, value, {timeout: ""})', (done) => {
        cache.set('test', 1, {
            timeout: 1
        });

        cache.get('test').should.equal(1);

        // 过期时间为1m，但执行会有延迟的
        setTimeout(() => {
            cache.get('test').should.equal(1);
        }, 100);

        setTimeout(() => {
            (cache.get('test') === null).should.be.true();
            done();
        }, 1500);
    });

    it('return set()', () => {
        cache.set().should.equal(cache)
    });

    it('return set(key)', () => {
        types.forEach(key => cache.set(key).should.equal(cache));
    });

    it('return set(key, value)', () => {
        types.forEach(key => cache.set(key, key).should.equal(cache));
    });

    it('remove(key)', function () {
        cache.set('aaa', 1);

        cache.remove('aaa');

        (cache.get('aaa') === null).should.be.true();
    });

    it('remove()', function () {
        cache.set('aaa', 1);
        cache.set('bbb', 1);
        cache.set('ccc', 1);

        readdirSync(cache.options.dir).length.should.equal(3);

        cache.remove();

        readdirSync(cache.options.dir).length.should.equal(0);
    });

    it('return remove()', function () {
        cache.remove().should.equal(cache);
    });

    it('return remove(key)', function () {
        types.forEach(key => cache.remove(key).should.equal(cache));

        cache.set('key', 1);
        cache.remove('key').should.equal(cache);
    });

    it('timeout remove file', function (done) {
        let filepath = './test/temp/.' + Date.now();
        let cache2 = new KeyCache({
            dir: filepath,
            timeout: 1
        });

        // 写入文件
        cache2.set('test', 1);

        setTimeout(function () {
            // 得先获取下才可以
            cache2.get('test');

            // 验证文件为空
            readdirSync(resolve(filepath)).length.should.equal(0);

            done();
        }, 1500);
    });

    it('string check', function () {
        cache.set('test', '1');
        cache.get('test').should.equal('1');
        cache.get('test').should.be.type('string');
    });

    it('boolean check', function () {
        cache.set('true', true);
        cache.set('false', false);

        cache.get('true').should.be.type('boolean');
        cache.get('true').should.equal(true);
        cache.get('false').should.equal(false);
    });

    it('number check', function () {
        cache.set('test', 1);
        cache.set('0', 0);

        cache.get('test').should.be.type('number');
        cache.get('test').should.equal(1);
        cache.get('0').should.equal(0);
    });

    it('function check', function () {
        cache.set('test', function () {});

        (cache.get('test') === null).should.be.true();
    });

    it('undefined check', function () {
        var a;
        cache.set('test', a);

        (cache.get('test') === null).should.be.true();
    });

    it('object check', function () {
        let result;
        let json = {
            status: 'ok',
            code: 0,
            flag: true,
            array: [
                0
            ]
        };

        cache.set('test', json);

        result = cache.get('test');

        result.should.eql(json);

        result.status.should.equal(json.status);
        result.code.should.equal(json.code);
        result.flag.should.equal(json.flag);
        result.array.should.eql(json.array);

        cache.set('null', null);
        (cache.get('null') === null).should.be.true();
    });
});
