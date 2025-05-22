import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import StoreAddStaffForm from './form/StoreAddStaffForm'
import { Button } from 'antd'

const StoreAddStaffItem = ({ storeId = '', owner = {}, staff = [] }) => {
  const { t } = useTranslation()
  return (
    <div className='d-inline-block'>
      <Button
        type='primary'
        className='btn btn-primary ripple text-nowrap rounded-1'
        data-bs-toggle='modal'
        data-bs-target='#add-staff-form'
      >
        <i className='fa-light fa-plus'></i>
        <span className='ms-2 res-hide'>{t('staffDetail.add')}</span>
      </Button>

      <Modal
        id='add-staff-form'
        hasCloseBtn={false}
        title={t('staffDetail.add')}
      >
        <StoreAddStaffForm storeId={storeId} owner={owner} staff={staff} />
      </Modal>
    </div>
  )
}
export default StoreAddStaffItem
