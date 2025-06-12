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
  ADMIN = 'admin'
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}
