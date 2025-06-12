export interface CategoryType {
  _id: string
  name: string
  slug: string
  image: string
  categoryId: string | CategoryType | null
  isDeleted: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProductType {
  _id: string
  name: string
  slug: string
  description: string
  price: { $numberDecimal: number }
  salePrice: { $numberDecimal: number }
  quantity: number
  sold: number
  isActive: boolean
  isSelling: boolean
  listImages: string[]
  categoryId: CategoryType
  brandId?: string | { _id: string; name: string }
  variantValueIds: string[]
  storeId:
    | string
    | { _id: string; name: string; isOpen?: boolean; isActive?: boolean }
  rating: number
  createdAt: string
  updatedAt: string
  isWishlist?: boolean
  numberOfFollowers?: number
}

export interface UserType {
  _id: string
  userName: string
  name: string
  email: string
  avatar: string
  cover?: string
  phone?: string
  addresses?: string[]
  role: 'user' | 'admin' | 'staff' | string
  isEmailActive: boolean
  createdAt?: string
  updatedAt?: string
  level?: LevelType
  cartCount?: number
  point?: number | string
  googleId?: string
  isPhoneActive?: boolean
  id_card?: string
}

export interface StoreType {
  _id: string
  name: string
  avatar: string
  cover?: string
  address?: string
  bio?: string
  ownerId: string | UserType
  isActive: boolean
  isOpen: boolean
  createdAt?: string
  updatedAt?: string
  level?: LevelType
  numberOfFollowers?: number
  isFollowing?: boolean
  rating: number
  commissionId?: string | CommissionType
  point?: number
}

export interface OrderItemType {
  _id: string
  productId: ProductType
  count: number
  price: { $numberDecimal: number }
  salePrice: { $numberDecimal: number }
  variantValueIds?: VariantValueType[]
  orderId?: string
  updatedAt?: string
}

export interface CartType {
  _id: string
  userId: string | UserType
  items: OrderItemType[]
  createdAt?: string
  updatedAt?: string
  store?: StoreType | string
}

export interface AddressType {
  street: string
  ward: string
  district: string
  city: string
  country?: string
  postalCode?: string
  [key: string]: any
}

export interface CommissionType {
  _id: string
  name: string
  value: number
  isDeleted: boolean
  fee: { $numberDecimal: number }
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface LevelType {
  _id: string
  name: string
  discount: { $numberDecimal: number }
  color: string
  minPoint: number
  isDeleted: boolean
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface VariantValueType {
  _id: string
  name: string
  variantId: { _id: string; name: string }
}

export interface ApiResponse<T> {
  data: T
  error?: string
  [key: string]: any
}

export interface ReportType {
  _id: string
  objectId: { _id: string; name?: string; content?: string }
  reportBy: { email?: string }
  reason?: string
  createdAt: string
}

export interface BrandType {
  _id: string
  name: string
  categoryIds: string[]
  isDeleted: boolean
  createdAt: string
}

export type CategoryFilter = {
  search: string
  categoryId: string | null
  sortBy: string
  order: string
  limit: number
  page: number
}

export type OrderDetailType = {
  _id: string
  orderId?: string
  storeId: string | StoreType
  userId: string | UserType
  items?: OrderItemType[]
  totalPrice?: { $numberDecimal: number }
  totalSalePrice?: { $numberDecimal: number }
  status: string
  createdAt: string
  updatedAt?: string
  isDeleted?: boolean
  paymentMethod?: string
  shippingAddress?: AddressType
  // Additional properties from API response
  userName: string
  name: string
  phone: string
  address: string
  isPaidBefore: boolean
  returnRequests?: {
    reason?: string
    status?: string
    [key: string]: any
  }
  shippingFee?: { $numberDecimal: string }
  amountFromUser?: { $numberDecimal: string }
}

export interface OrderType {
  _id: string
  createdAt: string
  userId: any
  storeId: any
  amountFromUser?: { $numberDecimal: number }
  amountToStore?: { $numberDecimal: number }
  amountToPtform?: { $numberDecimal: number }
  shippingFee?: { $numberDecimal: number }
  isPaidBefore?: boolean
  status?: string
}

export interface ReviewType {
  _id: string
  rating: number
  content: string
  productId: any
  createdAt: string
}
