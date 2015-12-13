/**
 * @file key-cache
 * @author xiaowu
 * @email fe.xiaowu@gmail.com
 */

'use strict';

import {existsSync, writeFileSync, readFileSync, unlinkSync} from 'fs';
import {mkdirsSync, emptyDirSync} from 'fs-extra';
import {resolve} from 'path';
import {createHash} from 'crypto';

export default class Key_cache {
    static options = {
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

    constructor(options = {}) {
        // 合并默认配置
        this.options = {...Key_cache.options, ...options};

        // 解析路径
        this.options.dir = resolve(this.options.dir);

        // 创建缓存目录
        mkdirsSync(this.options.dir);
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

        options = {...this.options, ...options};

        let data = {
            __time: null,
            __result: value
        };

        // 如果有过期时间则记录，否则忽略
        if (options.timeout !== null) {
            data.__time = Date.now();
            data.__end = options.timeout;
        }

        // 如果配置的缓存目录不是初始的则创建该目录，防止出错
        if (options.dir !== this.options.dir) {
            mkdirsSync(options.dir);
        }

        // 写入缓存
        writeFileSync(this._get_filepath(key, options), JSON.stringify(data));

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

        let md5 = createHash('md5');
        // unescape encodeURIComponent 兼容中文 md5
        md5.update(unescape(encodeURIComponent(key)));

        return  resolve(options.dir, md5.digest('hex') + '.json');
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
        if (!existsSync(filepath)) {
            return null;
        }

        let filedata = readFileSync(filepath).toString();

        try {
            filedata = JSON.parse(filedata);
        }
        catch (e) {
            return null;
        }

        // 如果没有时间就不是key-cache设置的，则忽略
        if (filedata.__time === undefined) {
            return null;
        }

        // 如果设置了时间并且过期了
        // 则删除这个缓存文件
        if (filedata.__time !== null && Date.now() - filedata.__time > filedata.__end * 1000) {
            this.remove(key);
            return null;
        }

        return filedata.__result;
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
            emptyDirSync(this.options.dir);
            return this;
        }

        let filepath = this._get_filepath(key);

        // 如果文件不存在
        if (!existsSync(filepath)) {
            return this;
        }

        // 删除文件
        unlinkSync(filepath);

        return this;
    }
}
