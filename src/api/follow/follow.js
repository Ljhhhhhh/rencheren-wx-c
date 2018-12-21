import request from '@/util/request'

export function fetchFollow({lx, page = 1, size = 5}) {
  return request({
    url: 'user/follows',
    method: 'POST',
    params: {
      data: {
        'page': page,
        'size': size,
        lx,
      },
    },
  })
}

export function delFollow(productIds) {
  return request({
    url: 'user/delFollow',
    method: 'POST',
    params: {
      data: {
        productIds,
      },
    },
  })
}
