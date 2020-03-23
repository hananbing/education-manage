import Vue from 'vue'
import axios from 'axios'
// import qs from 'qs';
import environment from '../environmental/index.js'
import { Message, Notification } from 'element-ui'
let baseURL = environment.env().url
let timmer = null;
// 响应时间
// axios.defaults.timeout = 30 * 1000;
// axios.defaults.withCredentials = true
// 配置请求头
// 配置接口地址
axios.defaults.baseURL = baseURL
// 静态资源
Vue.prototype.$static = ''
let pending = [] //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let CancelToken = axios.CancelToken
//删除已完成的请求
let removePending = (config, type) => {
  if (!config || !pending.length) return
  const url = config.url.match(/app(\S*)/);
  if (type === 'request') {
    const currUrl = '/' + (url ? url[0] : '') + '&' + config.method + '&' + JSON.stringify(config.data);
    const currPending = pending.find(item => item.u === currUrl)
    if (currPending) {
      //当当前请求在数组中存在时执行函数体
      currPending.fn() //执行取消操作
      pending = pending.filter(item => item.u !== currUrl) //把这条记录从数组中移除
      return currPending.count
    }
  } else {
    const currUrl = '/' + (url ? url[0] : '') + '&' + config.method + '&' + config.data;
    pending = pending.filter(item => item.u !== currUrl) //把这条记录从数组中移除
  }
}
axios.interceptors.request.use(
  config => {
    //过滤掉get请求
    if (config.method !== 'get') {
      const count = removePending(config, 'request') //在一个ajax发送前执行一下取消操作
      if (count > 1) {
        Message.error('您的操作过于频繁！')
      }
      config.cancelToken = new CancelToken(c => {
        let url = config.url
        if (url[0] !== '/') {
          url = '/' + url
        }
        //地址+方式+参数作为取消标识
        pending.push({
          u: url + '&' + config.method + '&' + JSON.stringify(config.data),
          fn: c,
          count: count ? count + 1 : 1
        })
      })
    }
    // config.headers['x-auth-token'] = sessionStorage.getItem('token')
    // config.headers['Access-Control-Allow-Origin'] = '*'
    return config
  },
  err => {
    //loadingInstance.close();
    Message.error('请求错误')
    return Promise.reject(err)
  }
)
// // 返回状态判断(添加响应拦截器)
axios.interceptors.response.use(
  res => {
    const timer = setTimeout(() => {
      removePending(res.config);
      clearTimeout(timer)
    }, 0)
    sessionStorage.setItem(
      'token', res.headers['x-auth-token'] || sessionStorage.getItem('token')
    )
    if (res.status > 199 && res.status < 300) {
      return res
    }
  },
  err => {
    removePending(err.config)
    // promise reject 后的拦截 以及取消请求后的拦截
    if (err && err.response) {
      if (err.response.status === 401) {
        clearTimeout(timmer);
        timmer = null;
        if (sessionStorage.token !== '') {
          Notification({
            title: '提示',
            message: '您的账号在另一地点登陆，已被迫下线'
          });
        }
        sessionStorage.setItem('token', '')
        // window.postMessage('loginout')
        timmer = setTimeout(function() {
          window.location.href = '/#/login'
        }, 5000);
      } else if (err.response.status === 403) {
        Message.error('没有访问权限！')
      } else if (err.response.status === 404) {
        Message.error('数据错误，未找到该资源！')
      } else if (String(err.response.data.status).length === 4) {
        // 需要特殊处理的错误
      } else {
        Message({
          type: 'error',
          dangerouslyUseHTMLString: true,
          message: err.response.data.message
        });
      }
      return Promise.reject(err.response)
    } else {
      if (typeof err.message === 'undefined') {
        return Promise.reject(err)
      }
    }
  }
)
/**
 * 下载文件
 * @param {String} url
 * @param {String} params 参数
 */
export function downloadFile(url, params = '') {
  return baseURL + url + params
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
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
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
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export function doGet(url, param = '') {
  return new Promise((resolve, reject) => {
    if (typeof param === 'string') {
      axios
        .get(url + param)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    } else {
      axios
        .get(url, {
          params: param
        })
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}
export function doDelete(url, params = '') {
  return new Promise((resolve, reject) => {
    if (typeof params !== 'object') {
      axios
        .delete(url + params)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    } else {
      axios
        .delete(url, {
          data: params
        })
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}
export function doPut(url, param1, param2) {
  return new Promise((resolve, reject) => {
    if (param2) {
      axios
        .put(url + param1, param2)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    } else {
      axios
        .put(url, param1)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    }
  })
}
