import request from '@/util/request'

export function fetchOrder({page = 1, size = 5}) {
  return request({
    url: 'biz/trades',
    method: 'POST',
    params: {
      data: {
        page,
        size,
      },
    },
  })
}

export function orderDetail(id) {
  return request({
    url: 'biz/trade',
    method: 'POST',
    params: {
      data: {
        id,
      },
    },
  })
}

export function delOrder(id) {
  return request({
    url: 'biz/deltrade',
    method: 'POST',
    params: {
      data: {
        id,
      },
    },
  })
}
