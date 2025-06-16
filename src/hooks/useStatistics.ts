import { useQuery } from '@tanstack/react-query'
import { listOrdersForAdmin, listOrdersByStore } from '../apis/order.api'
import {
  listProductsForAdmin,
  listProductsForManager
} from '../apis/product.api'
import { listUserForAdmin } from '../apis/user.api'
import { getStoresForAdmin } from '../apis/store.api'
import { OrderStatus, Role } from '../enums/OrderStatus.enum'
import { AdminStats, SellerStats } from '../@types/statistics.type'
import { calculateTotalRevenue } from '../utils/statisticsUtils'

export const useStatistics = (
  by: string,
  storeId?: string,
  dateRange?: [string, string] | null
) => {
  const fetchStats = async (): Promise<AdminStats | SellerStats> => {
    try {
      if (by === Role.ADMIN) {
        const [orderData, productData, userData, storeData] = await Promise.all(
          [
            listOrdersForAdmin({
              search: '',
              sortBy: 'createdAt',
              order: 'desc',
              status: OrderStatus.DELIVERED,
              limit: 1000,
              page: 1,
              ...(dateRange && {
                createdAtFrom: dateRange[0],
                createdAtTo: dateRange[1]
              })
            }),
            listProductsForAdmin({
              search: '',
              sortBy: 'sold',
              isActive: 'true',
              order: 'desc',
              limit: 1000,
              page: 1,
              ...(dateRange && {
                createdAtFrom: dateRange[0],
                createdAtTo: dateRange[1]
              })
            }),
            listUserForAdmin({
              search: '',
              sortBy: 'point',
              by: 'user',
              order: 'desc',
              limit: 1000,
              page: 1,
              ...(dateRange && {
                createdAtFrom: dateRange[0],
                createdAtTo: dateRange[1]
              })
            }),
            getStoresForAdmin({
              search: '',
              sortBy: 'point',
              sortMoreBy: 'rating',
              isActive: 'true',
              order: 'desc',
              limit: 1000,
              page: 1,
              ...(dateRange && {
                createdAtFrom: dateRange[0],
                createdAtTo: dateRange[1]
              })
            })
          ]
        )

        const orders = orderData.orders || []
        const products = productData.products || []
        const users = userData.users || []
        const stores = storeData.stores || []

        const orderSize =
          orderData.pagination?.total || orderData.size || orders.length
        const productSize =
          productData.pagination?.total || productData.size || products.length
        const userSize =
          userData.pagination?.total || userData.size || users.length
        const storeSize =
          storeData.pagination?.total || storeData.size || stores.length

        const adminStats: AdminStats = {
          items: {
            orders: orders.slice().reverse(),
            products: products,
            users: users,
            stores: stores
          },
          sizes: {
            orders: orderSize,
            products: productSize,
            users: userSize,
            stores: storeSize
          },
          totalRevenue: calculateTotalRevenue(orders, by)
        }
        return adminStats
      } else if (storeId) {
        const [orderData, productData] = await Promise.all([
          listOrdersByStore(storeId, {
            search: '',
            limit: 1000,
            sortBy: 'createdAt',
            order: 'desc',
            page: 1,
            status: OrderStatus.DELIVERED,
            ...(dateRange && {
              createdAtFrom: dateRange[0],
              createdAtTo: dateRange[1]
            })
          }),
          listProductsForManager(
            {
              search: '',
              sortBy: 'sold',
              isActive: 'true',
              order: 'desc',
              limit: 1000,
              page: 1,
              ...(dateRange && {
                createdAtFrom: dateRange[0],
                createdAtTo: dateRange[1]
              })
            },
            storeId
          )
        ])

        const orders = orderData?.data?.orders || []
        const products = productData?.data?.products || []

        const orderSize =
          orderData?.data?.pagination?.total ||
          orderData?.data?.size ||
          orders.length
        const productSize =
          productData?.data?.pagination?.total ||
          productData?.data?.size ||
          products.length
        const sellerStats: SellerStats = {
          items: {
            orders: orders.slice().reverse(),
            products: products
          },
          sizes: {
            orders: orderSize,
            products: productSize
          },
          totalRevenue: calculateTotalRevenue(orders, by)
        }
        return sellerStats
      }

      // Fallback data
      const fallbackData: AdminStats = {
        items: {
          orders: [],
          products: [],
          users: [],
          stores: []
        },
        sizes: {
          orders: 0,
          products: 0,
          users: 0,
          stores: 0
        },
        totalRevenue: 0
      }
      return fallbackData
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }
  return useQuery({
    queryKey: ['statistics', by, storeId, dateRange],
    queryFn: fetchStats,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })
}
