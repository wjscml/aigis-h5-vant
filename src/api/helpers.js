import axios from 'axios'
import qs from 'qs'
import Vue from 'vue'
import { Toast } from 'vant'

Vue.use(Toast)

const ERR_OK = '0'
// 请求时的拦截
axios.interceptors.request.use(config => {
  return config
}, err => {
  Toast('请求超时!')
  return Promise.resolve(err)
})
// 响应时的拦截
axios.interceptors.response.use(res => {
  if (res.status && res.status === 200) {
    const { errorCode, data, errorMessage } = res.data
    if (errorCode === ERR_OK) {
      Toast.clear()
      return data || errorMessage
    } else {
      return { data, errorMessage, errorCode }
    }
  }
}, err => {
  // 当响应异常时做一些处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400: err.message = '请求错误(400)'; break
      case 401: err.message = '未授权，请重新登录(401)'; break
      case 403: err.message = '拒绝访问(403)'; break
      case 404: err.message = '请求出错(404)'; break
      case 408: err.message = '请求超时(408)'; break
      case 500: err.message = '服务器错误(500)'; break
      case 501: err.message = '服务未实现(501)'; break
      case 502: err.message = '网络错误(502)'; break
      case 503: err.message = '服务不可用(503)'; break
      case 504: err.message = '网络超时(504)'; break
      case 505: err.message = 'HTTP版本不受支持(505)'; break
      default: err.message = `连接出错(${err.response.status})!`
    }
  } else {
    err.message = '连接服务器失败!'
  }
  Toast(err.message)
  return Promise.resolve(err)
})

const urlMap = {
  development: '/apis',
  production: '/apis'
}
const baseUrl = urlMap[process.env.NODE_ENV]

export function postApi (apiRoute) {
  return function (params, secretStr) {
    if (params && params.isShowLoading !== false) {
      Toast.loading('加载中...')
    }
    let url
    if (secretStr) {
      url = baseUrl + `/site/index?method=${apiRoute}&secretStr=${secretStr}&format=json`
    } else {
      url = baseUrl + `/site/index?method=${apiRoute}&format=json`
    }
    return axios({
      method: 'post',
      url: url,
      data: params,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }]
    }).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
}

export function postFileApi (apiRoute) {
  return function (params) {
    let loading
    if (params && params.isShowLoading !== false) {
      loading = document.getElementById('ajaxLoading')
      loading.style.display = 'block'
    }
    return axios({
      method: 'post',
      url: baseUrl + `/site/index?method=${apiRoute}&format=json`,
      data: params
    }).then((res) => {
      if (params && params.isShowLoading !== false) {
        loading = document.getElementById('ajaxLoading')
        loading.style.display = 'none'
      }
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
}

export function postNewsApi (apiRoute) {
  return function (params) {
    if (params && params.isShowLoading !== false) {
      Toast.loading('加载中...')
    }
    return axios({
      method: 'post',
      url: baseUrl + `/news/site/index?method=${apiRoute}&format=json`,
      data: params,
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
          ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
      }],
      timeout: 5000
    }).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
}

export function tradingviewApi (apiRoute) {
  return function (params) {
    var qsparams = qs.stringify(params)
    return axios({
      method: 'post',
      url: baseUrl + `/site/index?method=${apiRoute}&format=json`,
      data: qsparams
    }).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })
  }
}
