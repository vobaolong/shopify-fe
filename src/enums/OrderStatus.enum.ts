export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  RETURNED = 'Returned',
  CANCELLED = 'Cancelled'
}
export enum ReturnStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum Role {
  USER = 'user',
  STORE = 'store',
  ADMIN = 'admin',
  SELLER = 'seller'
}

export enum StoreStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  BANNED = 'banned'
}

export enum StoreRole {
  OWNER = 'owner',
  STAFF = 'staff'
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

export enum BaseStatus {
  ALL = 'all',
  ACTIVE = 'active',
  DELETED = 'deleted'
}

export enum SortType {
  ASC = 'asc',
  DESC = 'desc'
}

export enum ProductStatus {
  HIDDEN = 'hidden',
  OUT_OF_STOCK = 'outOfStock',
  INFRINGING = 'infringing',
  SELLING = 'selling',
  ALL = 'all'
}
