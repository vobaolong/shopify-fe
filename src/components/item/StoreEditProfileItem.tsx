import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import StoreEditProfileForm from './form/StoreEditProfileForm'
import { Button, Modal, Form } from 'antd'
import { EditOutlined } from '@ant-design/icons'

interface StoreEditProfileItemProps {
  store: {
    _id: string
    name?: string
    bio?: string
    address?: {
      _id: string
      provinceID: string
      provinceName: string
      districtID: string
      districtName: string
      wardID?: string
      wardName?: string
      address: string
    }
    [key: string]: any
  }
}

const StoreEditProfileItem = ({ store }: StoreEditProfileItemProps) => {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()

  const showModal = () => {
    setIsModalOpen(true)
  }
  const getAddressString = (address: any) => {
    if (!address) {
      return ''
    }
    if (typeof address === 'object' && address.address) {
      return address.address
    }
    return ''
  }

  const addressString = getAddressString(store.address)

  return (
    <div>
      <Button icon={<EditOutlined />} onClick={showModal}>
        <span className='hidden sm:inline'>{t('button.edit')}</span>
      </Button>

      <Modal
        title={t('storeDetail.editProfile')}
        open={isModalOpen}
        destroyOnHidden
        width={600}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        okText={t('button.save')}
      >
        <StoreEditProfileForm
          form={form}
          storeId={store._id}
          name={store.name}
          bio={store.bio}
          address={addressString}
        />
      </Modal>
    </div>
  )
}
export default StoreEditProfileItem
