import request from '@/util/request'

export function getVerifyCode(phone) {
  return request({
    url: 'user/smscode',
    method: 'POST',
    params: {
      data: {
        phone,
      },
    },
  })
}

export function bindMobile(phone, code, referee) {
  return request({
    url: 'user/bindMobile',
    method: 'POST',
    params: {
      data: {
        phone,
        code,
        referee,
      },
    },
  })
}
