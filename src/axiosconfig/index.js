import Vue from 'vue';
import axios from 'axios';
// import qs from 'qs';
import environment from '../environmental/index.js';
import { Message, Notification } from 'element-ui';
let baseURL = environment.env().url;
let timmer = null;
// 响应时间
// axios.defaults.timeout = 30 * 1000;
// axios.defaults.withCredentials = true
// 配置请求头
// 配置接口地址
axios.defaults.baseURL = baseURL;
// 静态资源
Vue.prototype.$static = '';
axios.interceptors.request.use(
    config => {
        config.headers['Authorization'] = 'Bearer ' + (sessionStorage.getItem('token') || '');
        return config;
    },
    err => {
        //loadingInstance.close();
        Message.error('请求错误');
        return Promise.reject(err);
    }
);
// // 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
    res => {
        if (res.status > 199 && res.status < 300) {
            return res;
        }
    },
    err => {
        if (err && err.response) {
            if (err.response.status === 401) {
                Message.error(err.response.data.detail);
                // clearTimeout(timmer);
                // timmer = null;
                // if (sessionStorage.token !== '') {
                //   Notification({
                //     title: '提示',
                //     message: '您的账号在另一地点登陆，已被迫下线'
                //   });
                // }
                // sessionStorage.setItem('token', '')
                // timmer = setTimeout(function() {
                //   window.location.href = '/#/login'
                // }, 5000);
            } else if (err.response.status === 403) {
                Message.error('没有访问权限！');
            } else if (err.response.status === 404) {
                Message.error('数据错误，未找到该资源！');
            } else if (String(err.response.data.status).length === 4) {
                // 需要特殊处理的错误
            } else {
                Message({
                    type: 'error',
                    // dangerouslyUseHTMLString: true,
                    message: err.response.data.detail
                });
            }
            return Promise.reject(err.response);
        } else {
            if (typeof err.message === 'undefined') {
                return Promise.reject(err);
            }
        }
    }
);
/**
 * 下载文件
 * @param {String} url
 * @param {String} params 参数
 */
export function downloadFile(url, params = '') {
    return baseURL + url + params;
}
/**
 * 上传文件  formData
 * @param {*} url
 * @param {*} formData
 */
export function doUploadFileFormData(url, formData) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    });
}
// 发送请求
export function doPost(url, params) {
    return new Promise((resolve, reject) => {
        axios({
            url: url,
            method: 'post',
            data: params
        })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err);
            });
    });
}
export function doGet(url, param = '') {
    return new Promise((resolve, reject) => {
        if (typeof param === 'string') {
            axios
                .get(url + param)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            axios
                .get(url, {
                    params: param
                })
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
}
export function doDelete(url, params = '') {
    return new Promise((resolve, reject) => {
        if (typeof params !== 'object') {
            axios
                .delete(url + params)
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            axios
                .delete(url, {
                    data: params
                })
                .then(res => {
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
}
export function doPut(url, param1, param2) {
    return new Promise((resolve, reject) => {
        if (param2) {
            axios
                .put(url + param1, param2)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        } else {
            axios
                .put(url, param1)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(err);
                });
        }
    });
}
