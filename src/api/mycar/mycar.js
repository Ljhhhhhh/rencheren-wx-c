import request from '@/util/request'

export function fetchCar(page, size) {
  return request({
    url: 'car/getList',
    method: 'POST',
    params: {
      data: {
        // 'page': page,
        // 'size': size
      },
    },
  })
}

export function addCar(data) {
  return request({
    url: 'car/saveCar',
    method: 'POST',
    params: {
      data: data,
    },
  })
}

export function updateCar(data) {
  return request({
    url: 'car/update',
    method: 'POST',
    params: {
      data: data,
    },
  })
}

export function deleteCar(ids) {
  return request({
    url: 'car/del',
    method: 'POST',
    params: {
      data: {
        ids: ids,
      },
    },
  })
}
