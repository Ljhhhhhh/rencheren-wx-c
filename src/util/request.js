import axios from 'axios'
import isWechat from './isWechat'
import qs from 'qs'
import md5 from 'blueimp-md5'
import cookie from 'js-cookie'
// create an axios instance
const SECRECT = 'y8q6wjtz3j1emtbwqnhipjgkpynpvmhh' // y8q6wjtz3j1emtbwqnhipjgkpynpvmhh
const service = axios.create({
  baseURL: 'http://api.chetianyi.com/api/', // api的base_url  http://testapi.chetianyi.com/api/
  timeout: 5000, // request timeoutheaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [function (data) {
    data = qs.stringify(data)
    return data
  }],
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  config.headers['crossorigin'] = isWechat() ? 'wx' : 'web'
  let params = JSON.stringify(config.params.data)
  config.headers['sign'] = params ? md5(params + '&' + SECRECT) : md5(SECRECT)
  config.headers['token'] = cookie.get('token') || '2oyzc25aa6y94e5b4nldz9mebux8230u' // 暂时用这个，登录接口完成之后修改
  // }
  return config
}, error => {
  alert('网络请求出现错误')
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.errno === 402) {
      cookie.remove('token')
      cookie.remove('openid')
      window.location.href = '/'
      // 669ux0l9phwy7rveb3xmexymjb2z9zz0 token
      // oLLgT1vPc3SF8tZHL3Tzlmlqc3pI openid
    }
    if (res.errno !== 0 && res.errmsg !== 'token失效，请重新登录') {
      console.log(res.errmsg)
    }
    return res
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    alert('网络请求失败，请检查网络后重试')
    console.log('err:' + error) // for debug
  })

export default service
