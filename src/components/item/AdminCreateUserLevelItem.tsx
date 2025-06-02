import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

interface AdminCreateUserLevelItemProps {
  onRun?: () => void
}

const AdminCreateUserLevelItem = ({
  onRun = () => {}
}: AdminCreateUserLevelItemProps) => {
  const { t } = useTranslation()

  return (
    <Button
      type='primary'
      icon={<i className='fa-light fa-plus' />}
      onClick={onRun}
    >
      {t('button.addLevel')}
    </Button>
  )
}
export default AdminCreateUserLevelItem
