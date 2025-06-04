import { useTranslation } from 'react-i18next'
import { Modal } from 'antd'
import { useState } from 'react'
import SellerAddProductImageForm from './form/SellerAddProductImageForm'

interface SellerAddProductImagesItemProps {
  count?: number
  productId?: string
  storeId?: string
  onRun?: () => void
}

const SellerAddProductImagesItem = ({
  count = 8,
  productId = '',
  storeId = '',
  onRun = () => {}
}: SellerAddProductImagesItemProps) => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  return (
    <div className='position-relative d-inline-block'>
      <div className='cus-tooltip'>
        {' '}
        <button
          type='button'
          disabled={count >= 7 ? true : false}
          className='btn add-value-btn ripple text-nowrap rounded-1'
          onClick={handleAddClick}
        >
          <small>
            <i className='fa-light fa-plus me-1' />
            {t('button.addImg')} {` (${count}/7)`}
          </small>{' '}
        </button>
      </div>
      {count >= 8 && (
        <small className='cus-tooltip-msg'>{t('productDetail.limitImg')}</small>
      )}

      {count < 8 && (
        <Modal
          title={t('productDetail.addImg')}
          open={modalVisible}
          onCancel={handleModalClose}
          footer={null}
          closable
        >
          <SellerAddProductImageForm
            storeId={storeId}
            productId={productId}
            onRun={onRun}
          />
        </Modal>
      )}
    </div>
  )
}

export default SellerAddProductImagesItem
