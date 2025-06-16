import React from 'react'
import { Card, Table } from 'antd'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { StatisticsOptions } from '../../@types/statistics.type'
import { humanReadableDate } from '../../helper/humanReadable'
import UserSmallCard from '../card/UserSmallCard'
import StoreSmallCard from '../card/StoreSmallCard'
import ProductSmallCard from '../card/ProductSmallCard'

interface DataTableProps {
  options: StatisticsOptions
  items: any[]
  by: string
  storeId?: string
}

const DataTable: React.FC<DataTableProps> = ({
  options,
  items,
  by,
  storeId
}) => {
  const { t } = useTranslation()

  const getTitle = () => {
    switch (options.flag) {
      case 'users':
        return t('topUser')
      case 'stores':
        return t('topShop')
      case 'products':
        return t('topProduct')
      default:
        return t('orderRecent')
    }
  }

  const getLinkPath = () => {
    const baseUrl = `/${by}/`
    if (by === 'admin') {
      return baseUrl + options.flag
    }
    return baseUrl + options.flag + 's/' + storeId
  }

  const getLinkText = () => {
    switch (options.flag) {
      case 'users':
        return t('goToUserManager')
      case 'stores':
        return t('goToShopManager')
      case 'products':
        return t('goToProductManager')
      default:
        return t('goToOrderManager')
    }
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      width: 50,
      render: (v: any) => (
        <span className='text-gray-500 font-medium'>{v + 1}</span>
      )
    },
    {
      title: (() => {
        switch (options.flag) {
          case 'users':
            return t('userDetail.name')
          case 'stores':
            return t('storeDetail.storeName')
          case 'products':
            return t('productDetail.name')
          default:
            return t('orderDetail.id')
        }
      })(),
      render: (_: any, item: any) => {
        if (options.flag === 'users') {
          return <UserSmallCard user={item} />
        }
        if (options.flag === 'stores') {
          return <StoreSmallCard store={item} />
        }
        if (options.flag === 'products') {
          return <ProductSmallCard product={item} rating={true} />
        }
        if (options.flag === 'orders') {
          return (
            <Link
              className='text-blue-500 hover:text-blue-700 transition-colors duration-200'
              to={`/${by}/${by === 'admin' ? 'order' : 'orders'}/detail/${item._id}${by !== 'admin' ? `/${storeId}` : ''}`}
            >
              <span className='text-sm font-mono'>{item._id}</span>
            </Link>
          )
        }
        return null
      }
    },
    {
      title: (() => {
        if (options.flag === 'users' || options.flag === 'stores') {
          return t('point')
        }
        if (options.flag === 'products') {
          return t('productDetail.sold')
        }
        return t('orderDetail.date')
      })(),
      width: 120,
      render: (_: any, item: any) => {
        if (options.flag === 'users') {
          return (
            <span className='text-yellow-600 font-semibold'>{item.point}</span>
          )
        }
        if (options.flag === 'stores') {
          return (
            <span className='text-purple-600 font-semibold'>{item.point}</span>
          )
        }
        if (options.flag === 'products') {
          return (
            <span className='text-green-600 font-semibold'>{item.sold}</span>
          )
        }
        if (options.flag === 'orders') {
          return (
            <span className='text-gray-600 text-sm'>
              {humanReadableDate(item.createdAt)}
            </span>
          )
        }
        return null
      }
    }
  ]

  const dataSource = (
    options.flag === 'orders' ? items.slice(-5).reverse() : items.slice(0, 5)
  ).map((item: any, idx: any) => ({ ...item, key: idx }))

  return (
    <Card
      title={
        <div className='flex items-center gap-2'>
          <span className='text-gray-800 font-semibold'>{getTitle()}</span>
          <span className='text-gray-400 text-sm'>({dataSource.length})</span>
        </div>
      }
      className='shadow-sm border border-gray-200'
      bodyStyle={{ padding: '0' }}
    >
      <Table
        dataSource={dataSource}
        pagination={false}
        size='small'
        columns={columns}
        className='border-none'
        scroll={{ x: true }}
      />
      <div className='p-4 border-t border-gray-100 bg-gray-50'>
        <Link
          to={getLinkPath()}
          className='inline-flex items-center gap-2 text-blue-500 hover:text-blue-700 transition-colors duration-200 font-medium'
        >
          {getLinkText()}
          <i className='fa-solid fa-arrow-right text-xs' />
        </Link>
      </div>
    </Card>
  )
}

export default DataTable
