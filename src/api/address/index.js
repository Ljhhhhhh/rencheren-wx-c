import request from '@/util/request'

/**
 * 省列表
 */
export function fetchProv() {
  return request({
    url: 'usr/car300/provlist',
    method: 'POST',
    params: {
      data: {},
    },
  })
}

/**
 * 城市列表
 */
export function fetchCity(provId) {
  return request({
    url: 'usr/car300/citylist',
    method: 'POST',
    params: {
      data: {
        prov_id: provId,
      },
    },
  })
}
