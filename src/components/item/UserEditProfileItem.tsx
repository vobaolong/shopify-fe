import { useTranslation } from 'react-i18next'
import Modal from '../ui/Modal'
import UserEditProfileForm from './form/UserEditProfileForm'
import { UserType } from '../../@types/entity.types'
import { Button } from 'antd'

interface UserEditProfileItemProps {
  user: UserType
}

const UserEditProfileItem = ({ user }: UserEditProfileItemProps) => {
  const { t } = useTranslation()
  return (
    <div className='position-relative d-inline-block'>
      <Button
        type='primary'
        className='btn btn-outline-primary rounded-1 ripple cus-tooltip'
        data-bs-toggle='modal'
        data-bs-target='#profile-edit-form'
      >
        <i className='fa-duotone fa-pen-to-square'></i>
        <span className='ms-2 res-hide'>{t('userDetail.editProfile')}</span>
      </Button>

      <Modal
        id='profile-edit-form'
        hasCloseBtn={false}
        title={t('userDetail.editProfile')}
      >
        <UserEditProfileForm
          firstName={user.firstName}
          lastName={user.lastName}
          email={user.email}
          phone={user.phone}
          id_card={user.id_card}
          googleId={Boolean(user.googleId)}
        />
      </Modal>

      <small className='cus-tooltip-msg'>{t('userDetail.editProfile')}</small>
    </div>
  )
}
export default UserEditProfileItem
