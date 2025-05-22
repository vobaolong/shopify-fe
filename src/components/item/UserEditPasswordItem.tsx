import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import UserEditPasswordForm from './form/UserEditPasswordForm'
import { Button } from 'antd'

const UserEditPasswordItem = () => {
  const { t } = useTranslation()
  return (
    <div className='position-relative d-inline-block'>
      <Button
        type='primary'
        className='btn btn-outline-primary rounded-1 ripple cus-tooltip'
        data-bs-toggle='modal'
        data-bs-target='#password-edit-form'
      >
        <i className='fa-solid fa-lock me-2'></i>
        {t('userDetail.changePassword')}
      </Button>

      <Modal
        id='password-edit-form'
        hasCloseBtn={false}
        title={t('userDetail.changePassword')}
      >
        <UserEditPasswordForm />
      </Modal>

      <small className='cus-tooltip-msg'>
        {t('userDetail.changePassword')}
      </small>
    </div>
  )
}
export default UserEditPasswordItem
