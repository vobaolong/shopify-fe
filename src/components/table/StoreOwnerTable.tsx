import { useTranslation } from 'react-i18next'
import UserSmallCard from '../card/UserSmallCard'
import { Alert, Table } from 'antd'
import { useState } from 'react'

const StoreOwnerTable = ({ heading = false, ownerId = {} }) => {
  const { t } = useTranslation()
  const [alerts, setAlerts] = useState(true)

  const columns = [
    {
      title: '#',
      dataIndex: '_id',
      key: '_id',
      width: '10%',
      render: (text: string) => <span>{text}</span>
    },
    {
      title: t('userDetail.name'),
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (text: string) => <span>{text}</span>
    },
    {
      title: t('userDetail.idCard'),
      dataIndex: 'id_card',
      key: 'id_card',
      width: '20%',
      render: (text: string) => <span>{text || '-'}</span>
    },
    {
      title: t('userDetail.email'),
      dataIndex: 'email',
      key: 'email',
      width: '20%',
      render: (text: string) => <span>{text || '-'}</span>
    },
    {
      title: t('userDetail.phone'),
      dataIndex: 'phone',
      key: 'phone',
      width: '20%',
      render: (text: string) => <span>{text || '-'}</span>
    }
  ]

  return (
    <div className='position-relative'>
      {heading && <h5 className='text-start'>{t('staffDetail.owner')}</h5>}{' '}
      {alerts ? (
        <Alert
          message={`${t('alert.theOwner')} ${t('alert.thisSectionContainsInfo')} ${t('alert.theShopOwner')}`}
          type='info'
          showIcon
          closable
          onClose={() => setAlerts(false)}
          className='mb-3'
        />
      ) : null}
      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='table-scroll my-2'>
          <Table
            columns={columns}
            dataSource={ownerId ? [ownerId] : []}
            rowKey='_id'
            pagination={false}
            className='mb-4'
            scroll={{ x: 'max-content' }}
          />
        </div>
      </div>
    </div>
  )
}

export default StoreOwnerTable
