/**
 * @file key-cache
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import fs from 'fs';
import extend from 'extend';
import path from 'path';
import md5 from 'MD5';
import del from 'del';
import mkdirp from 'mkdir-p';

export default class {
    options = {
        /**
         * 存放的缓存类型
         *
         * @default json
         * @type {String}
         */
        type: 'json',

        /**
         * 缓存目录
         *
         * @default 安装包里 dirname + .cache
         * @type {String}
         */
        dir: path.resolve(path.dirname(__dirname), '.cache'),

        /**
         * 保存的时间，单位秒，如果是null则表示一直保存
         *
         * @default null
         * @type {Number|null}
         */
        timeout: null
    }

    constructor(options = {}) {
        // 合并默认配置
        this.options = extend({}, this.options, options);

        // 解析路径
        this.options.dir = path.resolve(this.options.dir);

        // 创建目录
        this._mkdir_cachepath();
    }

    /**
     * 创建缓存目录
     */
    _mkdir_cachepath() {
        mkdirp.sync(this.options.dir);
    }

    /**
     * 设置缓存
     *
     * @param {string} key   key
     * @param {Object|string} value 值
     * @param {Object|undefined} options 可选配置
     * @return {Object} this
     */
    set(key, value, options = {}) {
        if (!key || !value) {
            return this;
        }


        let data = {};

        options = extend({}, this.options, options);

        // 记录写入日间
        data.__time = Date.now();

        // 判断文件类型
        if (options.type === 'json') {
            data.__result = JSON.stringify(value);
        }

        // 写入缓存
        fs.writeFileSync(this._get_filepath(key, options), JSON.stringify(data));

        return this;
    }

    /**
     * 获取缓存文件路径
     *
     * @private
     * @param  {string} key key
     * @param {Object|undefined} options 配置参数，如果为空则调用this.options
     *
     * @return {string}     文件绝对路径
     */
    _get_filepath(key, options) {
        options = options || this.options;

        return  path.resolve(options.dir, md5(key) + '.json');
    }

    /**
     * 获取缓存
     *
     * @param  {string} key key
     *
     * @return {Object|string|null}     结果，如果没有找到或者过期则为null
     */
    get(key) {
        let filepath = this._get_filepath(key);

        // 如果文件不存在
        if (!fs.existsSync(filepath)) {
            return null;
        }

        let filedata = fs.readFileSync(filepath).toString();
        try {
            filedata = JSON.parse(filedata);
        }
        catch (e) {
            return null;
        }

        // 如果没有时间
        if (filedata.__time === undefined) {
            return null;
        }

        // 如果设置了时间并且过期了
        // 则删除这个缓存文件
        if (filedata.__time !== null && Date.now() - filedata.__time > this.options.timeout * 1000) {
            return this.remove(key);
        }

        return this.options.type === 'json' ? JSON.parse(filedata.__result) : filedata.__result;
    }

    /**
     * 删除缓存
     *
     * @param  {string|undefined} key key，如果为空则全部删除
     *
     * @return {Object}     this
     */
    remove(key) {
        // 如果没有key则说明全部删除
        if (!key) {
            del.sync(path.resolve(this.options.dir));
            this._mkdir_cachepath();
            return this;
        }

        let filepath = this._get_filepath(key);

        // 如果文件不存在
        if (!fs.existsSync(filepath)) {
            return this;
        }

        // 删除文件
        fs.unlinkSync(filepath);

        return this;
    }
}
