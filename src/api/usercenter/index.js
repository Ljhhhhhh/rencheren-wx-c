import request from '@/util/request'

export function getCode(redirectUri) {
  return request({
    url: 'auth/getCode',
    method: 'POST',
    params: {
      data: {
        'redirect_uri': redirectUri || 'http://192.168.1.183/usercenter',
      },
    },
  })
}

export function getOpenid(code) {
  return request({
    url: 'auth/login_wx',
    method: 'POST',
    params: {
      data: {
        'code': code,
      },
    },
  })
}

export function getUserinfo(token) {
  return request({
    url: 'user/info',
    method: 'POST',
    params: {
      data: {
        'token': token,
      },
    },
  })
}
