import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserEditProfileForm from './form/UserEditProfileForm'
import { UserType } from '../../@types/entity.types'
import { Button, Modal } from 'antd'

interface UserEditProfileItemProps {
  user: UserType
}

const UserEditProfileItem = ({ user }: UserEditProfileItemProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <div className='relative inline-block'>
      <Button
        icon={<i className='fa-duotone fa-pen-to-square' />}
        type='default'
        variant='outlined'
        color='blue'
        onClick={() => setOpen(true)}
      >
        <span className='res-hide'>{t('userDetail.editProfile')}</span>
      </Button>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title={t('userDetail.editProfile')}
        destroyOnHidden
      >
        <UserEditProfileForm
          userName={user.userName}
          name={user.name}
          email={user.email}
          phone={user.phone}
          id_card={user.id_card}
          googleId={Boolean(user.googleId)}
        />
      </Modal>
    </div>
  )
}
export default UserEditProfileItem
