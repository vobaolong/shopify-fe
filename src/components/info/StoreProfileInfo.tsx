import { useTranslation } from 'react-i18next'
import StoreEditProfileItem from '../item/StoreEditProfileItem'
import { StoreType } from '../../@types/entity.types'
import { Card, Descriptions } from 'antd'

interface StoreProfileInfoProps {
  store: StoreType
  isEditable?: boolean
  showProfile?: boolean
}

const getDisplayAddress = (address: any): string => {
  if (!address) {
    return '-'
  }
  if (typeof address === 'object' && address.address) {
    return address.address
  }
  return '-'
}

const StoreProfileInfo = ({
  store,
  isEditable = false,
  showProfile = true
}: StoreProfileInfoProps) => {
  const { t } = useTranslation()

  return (
    <div className='w-full'>
      <Card className='p-3'>
        {' '}
        <Descriptions
          title={t('storeDetail.profile')}
          column={1}
          size='middle'
          layout='horizontal'
          colon={true}
          labelStyle={{
            width: '20%'
          }}
        >
          {showProfile && (
            <Descriptions.Item label={t('storeDetail.storeName')}>
              {store?.name || '-'}
            </Descriptions.Item>
          )}
          <Descriptions.Item label={t('storeDetail.bio')}>
            {store?.bio || '-'}
          </Descriptions.Item>
          {showProfile && (
            <Descriptions.Item label={t('storeDetail.pickupAddress')}>
              {getDisplayAddress(store.address)}
            </Descriptions.Item>
          )}
        </Descriptions>
        {isEditable && (
          <div className='flex justify-end mt-6 pt-4 border-t border-gray-100'>
            <StoreEditProfileItem store={store as any} />
          </div>
        )}
      </Card>

      {showProfile && (
        <Card className='p-3 mt-3'>
          <Descriptions
            title={t('storeDetail.contractNPoint')}
            column={1}
            layout='horizontal'
            colon={true}
            labelStyle={{
              width: '20%'
            }}
          >
            <Descriptions.Item label={t('storeDetail.typeOfStall')}>
              {typeof store.commissionId === 'object' &&
              store.commissionId !== null &&
              'name' in store.commissionId
                ? store.commissionId.name
                : '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('storeDetail.point')}>
              {store.point ?? '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('storeDetail.contactPerson')}>
              {typeof store.ownerId === 'object' &&
              store.ownerId !== null &&
              'email' in store.ownerId
                ? store.ownerId.email
                : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </div>
  )
}
export default StoreProfileInfo
