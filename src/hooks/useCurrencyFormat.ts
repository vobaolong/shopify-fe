import { useCurrency } from '../provider/CurrencyProvider'
import {
  formatPriceWithCurrency,
  formatChartPriceWithCurrency,
  formatThousands,
  Currency
} from '../utils/formats'

export const useCurrencyFormat = () => {
  const { currency } = useCurrency()
  const formatPrice = (value: number, sourceCurrency: Currency = 'VND') => {
    return formatPriceWithCurrency(value, sourceCurrency, currency)
  }

  const formatChartPrice = (
    value: number,
    sourceCurrency: Currency = 'VND'
  ) => {
    return formatChartPriceWithCurrency(value, sourceCurrency, currency)
  }

  const formatNumber = (value: number, decimals = 0) => {
    const locale = currency === 'VND' ? 'vi-VN' : 'en-US'
    return formatThousands(value, decimals, locale)
  }

  return {
    currency,
    formatPrice,
    formatChartPrice,
    formatNumber
  }
}
