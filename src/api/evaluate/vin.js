import request from '@/util/request'

/**
 * 按照vin寻找车辆
 * @param {vin} 车辆vin识别码
 */
export function findCarByVin(vin) {
  return request({
    url: 'usr/car300/vinsearch',
    method: 'POST',
    params: {
      data: {
        'vincode': vin,
      },
    },
  })
}

/**
 * 汽车品牌列表
 */
export function fetchCarBrand() {
  return request({
    url: 'car/index/brandlist',
    method: 'POST',
    params: {
      data: {
      },
    },
  })
}

/**
 * 根据车辆品牌寻找车系列表
 */
export function fetchCarSeries(brandId) {
  return request({
    url: 'car/index/serieslist',
    method: 'POST',
    params: {
      data: {
        brandId: brandId,
      },
    },
  })
}

/**
 * 根据车辆品牌寻找车系列表
 */
export function fetchCarMode(seriesId) {
  return request({
    url: 'car/index/modelist',
    method: 'POST',
    params: {
      data: {
        seriesId: seriesId,
      },
    },
  })
}

/**
 * 市场估价
 * @param {*} data
 */
export function evaluateFromMarket(data) {
  return request({
    url: 'usr/car300/eval',
    method: 'POST',
    params: {
      data: {
        modelId: data.modelId,
        regDate: data.regDate,
        mile: data.mile,
        zone: data.zone,
      },
    },
  })
}

/**
 * 精准估价（人车人估价）
 * @param {*} data
 */
export function evaluateFromRcr(data) {
  return request({
    url: 'usr/car300/evalaccurate',
    method: 'POST',
    params: {
      data: {
        modelId: data.modelId,
        regDate: data.regDate,
        makeDate: data.makeDate,
        mile: data.mile,
        zone: data.zone,
        color: data.color,
        interior: data.interior,
        surface: data.surface,
        work_state: data.work_state,
        transfer_times: data.transfer_times,
      },
    },
  })
}
