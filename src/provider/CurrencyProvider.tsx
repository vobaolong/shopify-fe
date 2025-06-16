import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Currency } from '../utils/formats'

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  toggleCurrency: () => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
)

interface CurrencyProviderProps {
  children: ReactNode
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children
}) => {
  const [currency, setCurrency] = useState<Currency>('VND')

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'VND' ? 'USD' : 'VND'))
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
