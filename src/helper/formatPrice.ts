export const formatPrice = (price: number) =>
  new Intl.NumberFormat('de-DE').format(price)

export const convertVNDtoUSD = (price: string) =>
  (parseFloat(price) * 0.00004).toFixed(2)

export const formatNumber = (e: { target: { value: string } }) => {
  let value = e.target.value
  value = value.replace(/[^0-9]/g, '')
  if (value === '') {
    e.target.value = ''
    return
  }
  e.target.value = parseInt(value).toLocaleString('vi-VN')
}
