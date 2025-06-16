# Hệ thống Đa Tiền Tệ (Multi-Currency System)

## Tổng quan

Hệ thống này cho phép người dùng chuyển đổi giữa VND và USD trong toàn bộ ứng dụng.

## Cài đặt

### 1. Wrap ứng dụng với CurrencyProvider

```tsx
import { CurrencyProvider } from './provider/CurrencyProvider'

function App() {
  return <CurrencyProvider>{/* Ứng dụng của bạn */}</CurrencyProvider>
}
```

### 2. Thêm CurrencyToggle vào Header

```tsx
import CurrencyToggle from './components/ui/CurrencyToggle'

function Header() {
  return (
    <div>
      {/* Các thành phần khác */}
      <CurrencyToggle />
    </div>
  )
}
```

## Sử dụng

### Hook useCurrencyFormat (Khuyên dùng)

```tsx
import { useCurrencyFormat } from '../hooks/useCurrencyFormat'

function Component() {
  const { formatPrice, formatChartPrice, currency } = useCurrencyFormat()

  return (
    <div>
      <p>Giá: {formatPrice(100000)}</p>
      <p>Chart: {formatChartPrice(1500000)}</p>
      <p>Tiền tệ hiện tại: {currency}</p>
    </div>
  )
}
```

### Hook useCurrency (Cơ bản)

```tsx
import { useCurrency } from '../provider/CurrencyProvider'
import { formatPriceWithCurrency } from '../utils/formats'

function Component() {
  const { currency, setCurrency, toggleCurrency } = useCurrency()

  const price = formatPriceWithCurrency(100000, 'VND', currency)

  return (
    <div>
      <p>Giá: {price}</p>
      <button onClick={toggleCurrency}>Đổi tiền tệ</button>
    </div>
  )
}
```

### Các hàm format trực tiếp

```tsx
import {
  formatPriceWithCurrency,
  formatChartPriceWithCurrency,
  convertCurrency
} from '../utils/formats'

// Format với chuyển đổi tiền tệ
const vndPrice = 100000
const usdPrice = formatPriceWithCurrency(vndPrice, 'VND', 'USD')

// Chuyển đổi trực tiếp
const convertedValue = convertCurrency(100000, 'VND', 'USD')
```

## Cấu hình

### Tỷ giá

Cập nhật tỷ giá trong `utils/formats.ts`:

```tsx
export const EXCHANGE_RATES = {
  VND_TO_USD: 0.000041, // Có thể lấy từ API
  USD_TO_VND: 24390
}
```

### API tỷ giá (Tương lai)

Có thể tích hợp với API tỷ giá thực tế:

```tsx
// Ví dụ: Lấy tỷ giá từ API
const fetchExchangeRate = async () => {
  const response = await fetch('https://api.exchangerate.com/...')
  return response.json()
}
```

## Ví dụ Format

### VND

- `100000` → `100.000 ₫`
- `1000000` → `1M VND` (chart)
- `1500000000` → `1.5B VND` (chart)

### USD

- `4.1` → `$4.10`
- `41` → `$41.00`
- `1000` → `$1K` (chart)
- `1500000` → `$1.5M` (chart)

## Components có sẵn

1. **CurrencyToggle**: Nút chuyển đổi tiền tệ cho header
2. **CurrencyProvider**: Context provider quản lý state
3. **useCurrencyFormat**: Hook tiện ích cho format
4. **useCurrency**: Hook cơ bản cho currency state

## Lưu ý

- Dữ liệu gốc luôn được lưu bằng VND
- Chuyển đổi chỉ để hiển thị
- Tỷ giá có thể cập nhật từ API thực tế
