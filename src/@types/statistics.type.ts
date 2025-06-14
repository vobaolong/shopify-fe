export interface AdminStats {
  items: {
    orders: any[]
    products: any[]
    users: any[]
    stores: any[]
  }
  sizes: {
    orders: number
    products: number
    users: number
    stores: number
  }
  lastWeekSizes: {
    orders: number
    products: number
    users: number
    stores: number
  }
  totalRevenue: number
  lastWeekRevenue: number
}

export interface SellerStats {
  items: {
    orders: any[]
    products: any[]
  }
  sizes: {
    orders: number
    products: number
  }
  lastWeekSizes: {
    orders: number
    products: number
  }
  totalRevenue: number
  lastWeekRevenue: number
}

export interface StatisticsOptions {
  flag: string
  by: string
  sliceEnd: number
  type: string
  dateRange?: [string, string] | null
}

export interface FlagOption {
  value: string
  label: string
  icon: React.ReactNode
}
