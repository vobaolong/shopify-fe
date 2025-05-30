import { Typography, Row, Col } from 'antd'
import EmailActiveButton from '../button/EmailActiveButton'
import PhoneActiveButton from '../button/PhoneActiveButton'
import UserEditProfileItem from '../item/UserEditProfileItem'
import UserEditPasswordItem from '../item/UserEditPasswordItem'
import { useTranslation } from 'react-i18next'
import { UserType } from '../../@types/entity.types'

const { Paragraph, Text } = Typography

interface UserProfileInfoProps {
  user: UserType
  isEditable?: boolean
}

const UserProfileInfo = ({
  user,
  isEditable = false
}: UserProfileInfoProps) => {
  const { t } = useTranslation()

  return (
    <div className='w-full p-4'>
      <Row gutter={[4, 4]}>
        <Col span={24}>
          <Paragraph>
            <Text strong>
              <i className='fa-light fa-user me-2 text-secondary'></i>
              {t('userDetail.username')}:
            </Text>{' '}
            {user.userName || '-'}
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph>
            <Text strong>
              <i className='fa-light fa-user me-2 text-secondary'></i>
              {t('userDetail.name')}:
            </Text>{' '}
            {user.name || '-'}
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph>
            <Text strong>
              <i className='fa-light fa-envelope me-2 text-secondary'></i>
              Email:
            </Text>{' '}
            {user.email || '-'}
            {isEditable && (
              <EmailActiveButton
                email={user.email}
                isEmailActive={user.isEmailActive}
                googleId={user.googleId}
              />
            )}
          </Paragraph>
        </Col>
        <Col span={24}>
          <Paragraph>
            <Text strong>
              <i className='fa-light fa-phone me-2 text-secondary'></i>
              {t('userDetail.phone')}:
            </Text>{' '}
            {user.phone || '-'}
          </Paragraph>
        </Col>
        {user.role !== 'admin' && (
          <Col span={24}>
            <Paragraph>
              <Text strong>
                <i className='fa-regular fa-credit-card me-2 text-secondary'></i>
                ID Card:
              </Text>{' '}
              {user.id_card || '-'}
            </Paragraph>
          </Col>
        )}
        {isEditable && (
          <div className='w-full flex justify-end gap-2'>
            <UserEditProfileItem user={user} />
            {!user.googleId && <UserEditPasswordItem />}
          </div>
        )}
      </Row>
    </div>
  )
}

export default UserProfileInfo
