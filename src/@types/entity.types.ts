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
  isFollowing?: boolean
  numberOfFollowers?: number
}

export interface UserType {
  _id: string
  firstName: string
  lastName: string
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
  numberOfSuccessfulOrders?: number
  numberOfFailedOrders?: number
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
  address: string
  ownerId: string | UserType
  isActive: boolean
  isOpen: boolean
  createdAt?: string
  updatedAt?: string
  level?: LevelType
  numberOfFollowers?: number
  isFollowing?: boolean
  numberOfSuccessfulOrders?: number
  numberOfFailedOrders?: number
  rating: number
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
