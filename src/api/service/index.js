import request from '@/util/request'

/**
 * 新增订单
 * data中的type 【A洗车,B维修,C买车,D租车,E卖车】
 */
export function orderAdd(data) {
  return request({
    url: 'biz/addTrade',
    method: 'POST',
    params: {
      data: data,
    },
  })
}

export function fetchNet() {
  const data = {
    lx: 'B',
  }
  return request({
    url: 'sys/servers',
    method: 'POST',
    params: {
      data: data,
    },
  })
}
