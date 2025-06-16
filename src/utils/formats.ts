// Định nghĩa các loại tiền tệ được hỗ trợ
export type Currency = 'VND' | 'USD'

// Tỷ giá chuyển đổi (có thể lấy từ API thực tế)
export const EXCHANGE_RATES = {
  VND_TO_USD: 0.000041, // 1 VND = 0.000041 USD
  USD_TO_VND: 24390 // 1 USD = 24,390 VND
}

/**
 * Chuyển đổi giá trị từ VND sang USD hoặc ngược lại
 */
export const convertCurrency = (
  value: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return value

  if (fromCurrency === 'VND' && toCurrency === 'USD') {
    return value * EXCHANGE_RATES.VND_TO_USD
  }

  if (fromCurrency === 'USD' && toCurrency === 'VND') {
    return value * EXCHANGE_RATES.USD_TO_VND
  }

  return value
}

/**
 * Format số với dấu phân cách hàng nghìn
 */
export const formatThousands = (
  value: number,
  decimals = 0,
  locale = 'vi-VN'
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Format giá tiền với ký hiệu tiền tệ
 */
export const formatPrice = (
  value: number,
  currency: Currency = 'VND'
): string => {
  const locale = currency === 'VND' ? 'vi-VN' : 'en-US'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'VND' ? 0 : 2,
    maximumFractionDigits: currency === 'VND' ? 0 : 2
  }).format(value)
}

/**
 * Format giá tiền cho chart với format compact
 */
export const formatChartPrice = (
  value: number,
  currency: Currency = 'VND'
): string => {
  const symbol = currency === 'VND' ? 'VND' : '$'

  if (currency === 'USD') {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toFixed(2)}`
  } else {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B ${symbol}`
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M ${symbol}`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K ${symbol}`
    }
    return `${value.toLocaleString('vi-VN')} ${symbol}`
  }
}

/**
 * Format giá tiền cho chart với chuyển đổi tiền tệ
 */
export const formatChartPriceWithCurrency = (
  value: number,
  sourceCurrency: Currency,
  displayCurrency: Currency
): string => {
  const convertedValue = convertCurrency(value, sourceCurrency, displayCurrency)
  return formatChartPrice(convertedValue, displayCurrency)
}

/**
 * Format giá tiền với chuyển đổi tiền tệ
 */
export const formatPriceWithCurrency = (
  value: number,
  sourceCurrency: Currency,
  displayCurrency: Currency
): string => {
  const convertedValue = convertCurrency(value, sourceCurrency, displayCurrency)
  return formatPrice(convertedValue, displayCurrency)
}

export const formatDate = (
  date: Date | string,
  format = 'dd/MM/yyyy'
): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat('vi-VN').format(d)
}
