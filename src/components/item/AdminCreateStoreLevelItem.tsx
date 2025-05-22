import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import AdminCreateStoreLevelForm from './form/AdminCreateStoreLevelForm'

interface AdminCreateStoreLevelItemProps {
  onRun?: () => void
}

const AdminCreateStoreLevelItem = ({
  onRun = () => {}
}: AdminCreateStoreLevelItemProps) => {
  const { t } = useTranslation()
  return (
    <div className='d-inline-block'>
      <button
        type='button'
        className='btn btn-primary ripple text-nowrap rounded-1'
        data-bs-toggle='modal'
        data-bs-target='#admin-create-level-form'
      >
        <i className='fa-light fa-plus'></i>
        <span className='ms-2 res-hide'>{t('button.addLevel')}</span>
      </button>

      <Modal
        id='admin-create-level-form'
        hasCloseBtn={false}
        title={t('dialog.createLevel')}
      >
        <AdminCreateStoreLevelForm onRun={onRun} />
      </Modal>
    </div>
  )
}
export default AdminCreateStoreLevelItem
