import { useTranslation } from 'react-i18next'
import LevelLabel from '../label/LevelLabel'
import { Row, Col, Typography } from 'antd'
import { formatDate } from '../../helper/humanReadable'
import UserRoleLabel from '../label/UserRoleLabel'
import { LevelType } from '../../@types/entity.types'

interface UserLevelInfoProps {
  user: {
    createdAt?: string
    level?: LevelType
    role?: string
  }
}

const { Text, Paragraph } = Typography

const UserLevelInfo = ({ user }: UserLevelInfoProps) => {
  const { t } = useTranslation()

  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        <Paragraph>
          <Text strong>{t('joined')}: </Text>
          {formatDate(user.createdAt || '')}
        </Paragraph>
      </Col>
      <Col span={24}>
        <Paragraph>
          <Text strong>{t('userDetail.level')}: </Text>{' '}
          <LevelLabel level={user.level} detail={false} />
        </Paragraph>
      </Col>
      <Col span={24}>
        <Paragraph>
          <Text strong>{t('role')}: </Text>
          <UserRoleLabel role={user.role} />
        </Paragraph>
      </Col>
    </Row>
  )
}

export default UserLevelInfo
