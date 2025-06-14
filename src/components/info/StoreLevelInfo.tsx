import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography, Button, Modal, Popover, Space } from 'antd'
import {
  StarFilled,
  ExclamationCircleOutlined,
  EllipsisOutlined
} from '@ant-design/icons'
import ListReport from '../item/form/ListReport'
import { getToken } from '../../apis/auth.api'
import { useSelector } from 'react-redux'
import { reportStoreReasons } from '../../constants/reasons.constant'
import { formatMonth } from '../../helper/humanReadable'
import { Role } from '../../enums/OrderStatus.enum'

interface StoreLevelInfoProps {
  store: any
}

const { Text } = Typography

const StoreLevelInfo = ({ store = {} }: StoreLevelInfoProps) => {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const user = useSelector((state: any) => state.account.user)

  const handleReportClick = () => {
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
  }

  const canReport =
    getToken() &&
    getToken().role === Role.USER &&
    user._id !== store?.ownerId?._id

  const reportMenu = (
    <Button
      type='link'
      onClick={handleReportClick}
      className='flex items-center p-0 !text-red-500'
      icon={<ExclamationCircleOutlined />}
    >
      {t('report')}
    </Button>
  )

  return (
    <div>
      <div className='relative '>
        <Space
          direction='horizontal'
          size='large'
          className='flex flex-col items-center justify-between'
        >
          <div className='flex items-center gap-2 min-w-[180px]'>
            <Text>{t('storeDetail.rating')}:</Text>
            <Text>
              {store.rating === 0 && store.numberOfReviews === 0
                ? '4'
                : store.rating}
              /5 <StarFilled className='!text-yellow-400 ml-1' />
            </Text>
            <Text>({store.numberOfReviews ?? 0})</Text>
          </div>

          <div className='flex items-center gap-2 min-w-[180px]'>
            <Text>{t('joined')}:</Text>
            <Text>{formatMonth(store.createdAt)}</Text>
          </div>

          <div className='flex items-center gap-2 min-w-[180px]'>
            <Text>{t('storeDetail.followers')}:</Text>
            <Text>{store.numberOfFollowers}</Text>
          </div>
        </Space>

        {canReport && (
          <Popover
            className='!absolute top-0 right-0'
            content={reportMenu}
            trigger='click'
            placement='bottomRight'
          >
            <Button
              type='text'
              size='small'
              icon={<EllipsisOutlined />}
              className='hover:bg-gray-100 rounded-full'
            />
          </Popover>
        )}
      </div>

      <Modal
        title={t('dialog.report')}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        closable
      >
        <ListReport
          reasons={reportStoreReasons}
          objectId={store._id}
          reportBy={user._id}
          isStore={true}
          isProduct={false}
          isReview={false}
        />
      </Modal>
    </div>
  )
}

export default StoreLevelInfo
