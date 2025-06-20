import { Tag } from 'antd'
import { useTranslation } from 'react-i18next'
import { StoreRole } from '../../enums/OrderStatus.enum'

const UserRoleLabel = ({ role = '' }: { role?: string }) => {
  const { t } = useTranslation()
  const getTagColor = (role: string) => {
    return role === StoreRole.OWNER ? 'blue' : 'green'
  }
  return <Tag color={getTagColor(role)}>{t(`userDetail.${role}`)}</Tag>
}

export default UserRoleLabel
