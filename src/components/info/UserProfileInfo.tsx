import { Typography, Row, Col } from 'antd'
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
      <Row gutter={[16, 12]}>
        <Col span={8} className='text-right pr-4'>
          <Text strong>{t('userDetail.userName')}:</Text>
        </Col>
        <Col span={16}>
          <Text>{user.userName || '-'}</Text>
        </Col>
        <Col span={8} className='text-right pr-4'>
          <Text strong>{t('userDetail.name')}:</Text>
        </Col>
        <Col span={16}>
          <Text>{user.name || '-'}</Text>
        </Col>
        <Col span={8} className='text-right pr-4'>
          <Text strong>Email:</Text>
        </Col>
        <Col span={16}>
          <Text>{user.email || '-'}</Text>
        </Col>
        <Col span={8} className='text-right pr-4'>
          <Text strong>{t('userDetail.phone')}:</Text>
        </Col>
        <Col span={16}>
          <Text>{user.phone || '-'}</Text>
        </Col>
        {user.role !== 'admin' && (
          <>
            <Col span={8} className='text-right pr-4'>
              <Text strong>ID Card:</Text>
            </Col>
            <Col span={16}>
              {(user.id_card || '')
                .toString()
                .replace(/(\d{4})/g, '$1 ')
                .trim() || '-'}
            </Col>
          </>
        )}
        {isEditable && (
          <Col span={24} className='mt-4'>
            <div className='w-full flex justify-end gap-2'>
              <UserEditProfileItem user={user} />
              {!user.googleId && <UserEditPasswordItem />}
            </div>
          </Col>
        )}
      </Row>
    </div>
  )
}

export default UserProfileInfo
