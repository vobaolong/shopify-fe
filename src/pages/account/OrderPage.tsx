import { useState } from 'react'
import AccountLayout from '../../components/layout/AccountLayout'
import UserOrdersTable from '../../components/table/UserOrdersTable'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'
import { useSelector } from 'react-redux'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'

const OrderPage = () => {
  const user = useSelector((state: any) => state.account.user)
  const { t } = useTranslation()

  const [selectedStatus, setSelectedStatus] = useState(
    'Pending|Processing|Shipped|Delivered|Cancelled|Returned'
  )

  const orderStatus = [
    {
      label: t('status.all'),
      value: 'Pending|Processing|Shipped|Delivered|Cancelled|Returned'
    },
    { label: t('status.pending'), value: 'Pending' },
    { label: t('status.processing'), value: 'Processing' },
    { label: t('status.shipped'), value: 'Shipped' },
    { label: t('status.delivered'), value: 'Delivered' },
    { label: t('status.cancelled'), value: 'Cancelled' },
    { label: t('status.returned'), value: 'Returned' }
  ]

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
  }

  const items: TabsProps['items'] = orderStatus.map((status) => ({
    key: status.value,
    label: status.label,
    children: <UserOrdersTable heading={false} status={status.value} />
  }))

  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.myPurchase'), url: '/account/order' }
  ]

  return (
    <AccountLayout user={user} paths={paths}>
      <MetaData title={`${t('helmet.myPurchase')} | ShopBase Việt Nam`} />
      <div className='bg-white rounded-lg shadow-sm p-4'>
        <Tabs
          defaultActiveKey={selectedStatus}
          items={items}
          onChange={handleStatusChange}
        />
      </div>
    </AccountLayout>
  )
}

export default OrderPage
