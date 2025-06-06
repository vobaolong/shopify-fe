import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserEditPasswordForm from './form/UserEditPasswordForm'
import { Button, Modal } from 'antd'

const UserEditPasswordItem = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <div className='relative inline-block'>
      <Button
        icon={<i className='fa-solid fa-lock' />}
        type='primary'
        onClick={() => setOpen(true)}
      >
        {t('userDetail.changePassword')}
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={t('userDetail.changePassword')}
        destroyOnHidden
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
