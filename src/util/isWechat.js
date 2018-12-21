const isWechat = function () {
  let flag = null
  let ua = navigator.userAgent.toLowerCase()
  if (flag === null) {
    flag = /MicroMessenger/i.test(ua)
  }
  return flag
}

export default isWechat
