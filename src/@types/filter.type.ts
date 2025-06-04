export interface BaseFilterState {
  search?: string
  sortBy?: string
  order?: 'asc' | 'desc'
  limit?: number
  page?: number
  searchField?: string
  createdAtFrom?: string
  createdAtTo?: string
}

export interface TableFilterState extends BaseFilterState {
  status?: string
}

export interface OrderFilterState extends BaseFilterState {
  status?: string
  isPaidBefore?: string
}

export interface TransactionFilterState extends BaseFilterState {
  type?: string
  isPaidBefore?: string
}

export interface VariantFilterState extends BaseFilterState {
  status?: string
}

export interface StoreFilterState extends BaseFilterState {
  isActive?: boolean
  commissionId?: string
  rating?: string
}

export interface UserFilterState extends BaseFilterState {
  role?: string
  isEmailActive?: boolean
  isActive?: boolean
  commissionId?: string
  rating?: string
}

export interface ProductFilterState extends BaseFilterState {
  quantity?: number
  isSelling?: boolean
  isActive?: boolean
}

export interface BrandFilterState extends BaseFilterState {
  categoryId?: string
}

export interface CategoryFilterState extends BaseFilterState {
  categoryId?: string
}

export interface CommissionFilterState extends BaseFilterState {
  status?: string
  dateRange?: [string, string]
}

export interface LevelFilterState extends BaseFilterState {
  status?: string
}

export interface ReportFilterState extends BaseFilterState {
  activeTab?: string
  isStore?: boolean
  isProduct?: boolean
  isReview?: boolean
  field?: string
}

export interface ReturnFilterState extends BaseFilterState {
  status?: string
}

export interface StaffFilterState extends BaseFilterState {
  // Staff tables typically don't have additional filters beyond base
}

// Common default filter states
export const createDefaultFilter = <T extends BaseFilterState>(
  overrides?: Partial<T>
): T => {
  return {
    search: '',
    sortBy: 'createdAt',
    order: 'desc',
    limit: 10,
    page: 1,
    ...overrides
  } as T
}

// Specific default filters
export const defaultTableFilter: TableFilterState =
  createDefaultFilter<TableFilterState>({
    status: 'all'
  })

export const defaultOrderFilter: OrderFilterState =
  createDefaultFilter<OrderFilterState>({
    sortBy: 'createdAt',
    limit: 7,
    status: 'all'
  })

export const defaultTransactionFilter: TransactionFilterState =
  createDefaultFilter<TransactionFilterState>({
    sortBy: 'createdAt',
    limit: 10
  })

export const defaultVariantFilter: VariantFilterState =
  createDefaultFilter<VariantFilterState>({
    sortBy: 'name',
    order: 'asc',
    limit: 8,
    status: 'all'
  })

export const defaultStoreFilter: StoreFilterState =
  createDefaultFilter<StoreFilterState>({
    sortBy: 'name',
    limit: 12
  })

export const defaultUserFilter: UserFilterState =
  createDefaultFilter<UserFilterState>({
    sortBy: 'point',
    role: 'customer',
    limit: 10
  })

export const defaultProductFilter: ProductFilterState =
  createDefaultFilter<ProductFilterState>({
    sortBy: 'sold',
    order: 'desc',
    limit: 8,
    quantity: -1
  })

export const defaultBrandFilter: BrandFilterState =
  createDefaultFilter<BrandFilterState>({
    sortBy: 'name',
    order: 'asc',
    limit: 8
  })

export const defaultCategoryFilter: CategoryFilterState =
  createDefaultFilter<CategoryFilterState>({
    sortBy: 'categoryId',
    order: 'asc',
    limit: 5
  })

export const defaultCommissionFilter: CommissionFilterState =
  createDefaultFilter<CommissionFilterState>({
    sortBy: 'name',
    order: 'asc',
    limit: 10,
    status: 'all'
  })

export const defaultLevelFilter: LevelFilterState =
  createDefaultFilter<LevelFilterState>({
    sortBy: 'point',
    order: 'asc',
    limit: 6,
    status: 'all'
  })

export const defaultReportFilter: ReportFilterState =
  createDefaultFilter<ReportFilterState>({
    sortBy: 'createdAt',
    limit: 10,
    activeTab: 'stores',
    isStore: true,
    field: '_id'
  })

export const defaultReturnFilter: ReturnFilterState =
  createDefaultFilter<ReturnFilterState>({
    sortBy: 'createdAt',
    order: 'desc',
    limit: 7,
    status: ''
  })

export const defaultStaffFilter: StaffFilterState =
  createDefaultFilter<StaffFilterState>({
    sortBy: 'name',
    order: 'asc',
    limit: 6
  })
