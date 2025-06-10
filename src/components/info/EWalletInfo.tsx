import { useTranslation } from 'react-i18next'
import { formatPrice } from '../../helper/formatPrice'
import { Typography, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { getStore } from '../../apis/store.api'
import { getUser } from '../../apis/user.api'

interface EWalletInfoProps {
  userId?: string
  storeId?: string
  eWallet?: number
  type?: 'user' | 'store'
}

const { Text } = Typography

const EWalletInfo = ({
  userId,
  storeId,
  eWallet = 0,
  type = 'user'
}: EWalletInfoProps) => {
  const { t } = useTranslation()

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId!),
    enabled: type === 'user' && !!userId,
    refetchInterval: 30000
  })

  const { data: storeData, isLoading: storeLoading } = useQuery({
    queryKey: ['store', storeId],
    queryFn: () => getStore(storeId!),
    enabled: type === 'store' && !!storeId,
    refetchInterval: 30000
  })

  let balance = eWallet
  if (type === 'user' && userData?.user?.e_wallet?.$numberDecimal) {
    balance = userData.user.e_wallet.$numberDecimal
  } else if (type === 'store' && storeData?.store?.e_wallet?.$numberDecimal) {
    balance = storeData.store.e_wallet.$numberDecimal
  }

  const isLoading = userLoading || storeLoading

  return (
    <div className='inline-flex items-center text-gray-800 text-xl'>
      <Text type='secondary' className='text-base'>
        {t('myBalance')}:
      </Text>
      {isLoading ? (
        <Spin size='small' className='mx-2' />
      ) : (
        <span className='mx-2 font-bold'>
          {formatPrice(balance)}
          <sup>₫</sup>
        </span>
      )}
    </div>
  )
}
export default EWalletInfo
