import Paragraph from '../ui/Paragraph'
import { humanReadableDate } from '../../helper/humanReadable'
import { useTranslation } from 'react-i18next'
import { Typography, Card } from 'antd'

interface StoreJoinedInfoProps {
  store: any
}

const { Text } = Typography

const StoreJoinedInfo: React.FC<StoreJoinedInfoProps> = ({ store = {} }) => {
  const { t } = useTranslation()
  return (
    <div className='container-fluid'>
      <Card className='row py-2 border rounded-1'>
        {/* <div className='col-12'>
        <Paragraph
          label='Type'
          value={<StoreCommissionLabel commission={store.commissionId} />}
        />
      </div> */}

        <div className='col-12'>
          <Paragraph
            label={
              <span>
                <i className='fa-solid fa-user-check me-1 text-secondary' />
                {t('joined')}
              </span>
            }
            time={humanReadableDate(store.createdAt)}
          />
        </div>
      </Card>
    </div>
  )
}
export default StoreJoinedInfo
