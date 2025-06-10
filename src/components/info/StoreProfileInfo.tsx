import { useTranslation } from 'react-i18next'
import StoreEditProfileItem from '../item/StoreEditProfileItem'
import { StoreType } from '../../@types/entity.types'
import { Typography, Card, Space, Divider } from 'antd'
import { ShopOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons'

interface StoreProfileInfoProps {
  store: StoreType
  isEditable?: boolean
  showProfile?: boolean
}

const { Title, Text } = Typography
const getDisplayAddress = (address: any): string => {
  if (!address) {
    return '-'
  }

  if (typeof address === 'string') {
    return address
  }

  if (typeof address === 'object') {
    if (address.address) {
      return address.address
    }

    if (address.provinceName || address.districtName || address.wardName) {
      const parts = []
      if (address.wardName) parts.push(address.wardName)
      if (address.districtName) parts.push(address.districtName)
      if (address.provinceName) parts.push(address.provinceName)
      return parts.length > 0 ? parts.join(', ') : '-'
    }
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
    <div className='w-full max-w-4xl mx-auto space-y-6'>
      <Card className='shadow-sm border border-gray-200'>
        {showProfile && (
          <>
            <Title level={4} className='mb-4 text-gray-800'>
              {t('storeDetail.profile')}
            </Title>
            <Divider className='mt-0 mb-6' />
          </>
        )}

        <Space direction='vertical' size='large' className='w-full'>
          {showProfile && (
            <div className='flex gap-2'>
              <Text strong>{t('storeDetail.storeName')}:</Text>
              <Text>{store?.name || '-'}</Text>
            </div>
          )}

          <div className='flex gap-2'>
            <Text strong>{t('storeDetail.bio')}:</Text>
            <Text>{store?.bio || '-'}</Text>
          </div>

          {showProfile && (
            <div className='flex gap-2'>
              <Text strong>{t('storeDetail.pickupAddress')}:</Text>
              <Text>{getDisplayAddress(store.address)}</Text>
            </div>
          )}
        </Space>

        {isEditable && (
          <div className='flex justify-end mt-6 pt-4 border-t border-gray-100'>
            <StoreEditProfileItem store={store as any} />
          </div>
        )}
      </Card>

      {showProfile && (
        <Card className='shadow-sm border border-gray-200'>
          <Title level={4} className='mb-4 text-gray-800'>
            {t('storeDetail.contractNPoint')}
          </Title>
          <Divider className='mt-0 mb-6' />

          <Space direction='vertical' size='large' className='w-full'>
            <div className='flex items-start gap-3'>
              <ShopOutlined className='text-purple-500 mt-1 text-lg' />
              <div className='flex-1'>
                <Text strong>{t('storeDetail.typeOfStall')}:</Text>
                <Text>
                  {typeof store.commissionId === 'object' &&
                  store.commissionId !== null &&
                  'name' in store.commissionId
                    ? store.commissionId.name
                    : '-'}
                </Text>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <TrophyOutlined className='text-yellow-500 mt-1 text-lg' />
              <div className='flex-1'>
                <Text strong>{t('storeDetail.point')}:</Text>
                <Text>{store.point ?? '-'}</Text>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <UserOutlined className='text-indigo-500 mt-1 text-lg' />
              <div className='flex-1'>
                <Text strong>{t('storeDetail.contactPerson')}:</Text>
                <Text>
                  {typeof store.ownerId === 'object' &&
                  store.ownerId !== null &&
                  'email' in store.ownerId
                    ? store.ownerId.email
                    : '-'}
                </Text>
              </div>
            </div>
          </Space>
        </Card>
      )}
    </div>
  )
}
export default StoreProfileInfo
