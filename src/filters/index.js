import dayjs from 'dayjs'
export function toUpperCase (str) {
  return str.toLocaleUpperCase()
}

export function padStartIndex(index, list) {
  let pad = (list.length + '').split('').length
  return (index + '').padStart(pad, 0)
};
export function formatPrice(price) {
  if (price >= 10000) {
    price = (price / 10000).toFixed(2) + '万'
  }
  return price
};

export function formatTime(time) {
  return dayjs(time).format('YYYY/MM/DD')
}

export function formatMile(mile) {
  if (!mile) {
    return '未知'
  }
  let m = ''
  if (Number(mile) > 1000) {
    m = (mile / 1000).toFixed(2) + 'K'
  } else {
    m = mile
  }
  m += 'm'
  return m
}
