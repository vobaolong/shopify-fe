import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserAddAddressForm from './form/UserAddAddressForm'
import { Button, Modal, Typography, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Title } = Typography

interface UserAddAddressItemProps {
  heading?: boolean
  count?: number
  detail?: boolean
}

const UserAddAddressItem: React.FC<UserAddAddressItemProps> = ({
  heading = false,
  count = 0,
  detail = true
}) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='flex items-center justify-between w-full'>
      {heading && (
        <Title level={5} className='m-0 text-left'>
          {t('userDetail.address')}
        </Title>
      )}
      <div className='relative'>
        <Tooltip
          title={count >= 10 ? t('userDetail.limit10Addresses') : ''}
          placement='topRight'
        >
          <Button
            type='primary'
            icon={<PlusOutlined />}
            disabled={count >= 10}
            onClick={() => setIsModalOpen(true)}
          >
            {detail && (
              <span className='hidden sm:inline'>
                {t('userDetail.addAddress')}
              </span>
            )}
          </Button>
        </Tooltip>

        <Modal
          open={isModalOpen && count < 10}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          title={t('userDetail.addAddress')}
          destroyOnClose
        >
          <UserAddAddressForm onSuccess={() => setIsModalOpen(false)} />
        </Modal>
      </div>
    </div>
  )
}

export default UserAddAddressItem
