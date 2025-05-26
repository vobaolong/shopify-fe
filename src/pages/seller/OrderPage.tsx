import { useSelector } from 'react-redux'
import SellerLayout from '../../components/layout/SellerLayout'
import SellerOrdersTable from '../../components/table/SellerOrdersTable'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const OrderPage = () => {
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.account.user)
  const store = useSelector((state: any) => state.seller.store)
  const { t } = useTranslation()
  const [selectedStatus, setSelectedStatus] = useState('Pending')

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

  const paths = [
    { name: t('breadcrumbs.home'), url: `/seller/${store._id}` },
    { name: t('breadcrumbs.order'), url: `/seller/orders/${store._id}` }
  ]

  const handleStatusChange = (status) => {
    setSelectedStatus(status)
    navigate(`/seller/orders/${store._id}/${status}`)
  }

  return (
    <SellerLayout user={user} store={store} paths={paths}>
      <div className='nav nav-tabs bg-body rounded-top-1 box-shadow mb-2'>
        {orderStatus.map((status) => (
          <li
            className='nav-item flex-grow-1 text-center pointer'
            key={status.value}
          >
            <span
              className={`nav-link h-100 ${
                selectedStatus === status.value ? `active` : ``
              }`}
              onClick={() => handleStatusChange(status.value)}
            >
              {status.label}
            </span>
          </li>
        ))}
      </div>
      <SellerOrdersTable
        heading={false}
        storeId={store._id}
        isEditable={
          selectedStatus === 'Pending' ||
          selectedStatus === 'Processing' ||
          selectedStatus === 'Shipped'
        }
        status={selectedStatus}
      />
    </SellerLayout>
  )
}

export default OrderPage
