import React from 'react'
import {
  InboxOutlined,
  UserOutlined,
  ShopOutlined,
  LineChartOutlined,
  ShoppingOutlined
} from '@ant-design/icons'
import { OrderStatus, Role } from '../enums/OrderStatus.enum'

export const calculateTotalRevenue = (orders: any[], by: string): number => {
  return orders.reduce((totalRevenue: number, order: any) => {
    if (order.status === OrderStatus.DELIVERED) {
      const amount =
        by === Role.ADMIN
          ? (order?.amountToPlatform?.$numberDecimal ?? 0)
          : (order?.amountToStore?.$numberDecimal ?? 0)
      return totalRevenue + parseFloat(amount)
    }
    return totalRevenue
  }, 0)
}

export const getChartIcon = (flag: string): React.ReactNode => {
  const iconStyle = {
    fontSize: '20px',
    padding: '12px',
    borderRadius: '5px'
  }

  const iconMap: Record<string, React.ReactNode> = {
    orders: (
      <ShoppingOutlined
        style={{
          ...iconStyle,
          color: '#1890ff',
          backgroundColor: '#e6f7ff'
        }}
      />
    ),
    products: (
      <InboxOutlined
        style={{
          ...iconStyle,
          color: '#52c41a',
          backgroundColor: '#f6ffed'
        }}
      />
    ),
    users: (
      <UserOutlined
        style={{
          ...iconStyle,
          color: '#faad14',
          backgroundColor: '#fffbe6'
        }}
      />
    ),
    stores: (
      <ShopOutlined
        style={{
          ...iconStyle,
          color: '#722ed1',
          backgroundColor: '#f9f0ff'
        }}
      />
    )
  }

  return (
    iconMap[flag] || (
      <LineChartOutlined
        style={{
          ...iconStyle,
          color: '#8c8c8c',
          backgroundColor: '#f5f5f5'
        }}
      />
    )
  )
}
