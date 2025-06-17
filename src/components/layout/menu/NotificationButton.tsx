import { useEffect } from 'react'
import { Badge, Button, Popover, Empty, Divider } from 'antd'
import { BellOutlined, DeleteOutlined } from '@ant-design/icons'
import { deleteNotifications } from '../../../apis/notification.api'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { timeAgo } from '../../../helper/calcTime'
import { humanReadableDate } from '../../../helper/humanReadable'
import { socketId } from '../../../socket'
import { selectAccountUser } from '../../../store/slices/accountSlice'
import { selectSellerStore } from '../../../store/slices/sellerSlice'
import {
  useNotifications,
  useMarkNotificationsRead
} from '../../../hooks/useNotification'
import { Role } from '../../../enums/OrderStatus.enum'

interface Notification {
  _id: string
  message: string
  objectId: string
  isRead: boolean
  createdAt: string
}

const NotificationButton = ({ navFor = '' }: { navFor?: string }) => {
  const { t } = useTranslation()
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const { data, refetch } = useNotifications(user?._id as string)
  const markReadMutation = useMarkNotificationsRead()
  const list: Notification[] = data?.notifications || []
  const notificationCount = data?.numberHidden || list.length

  const handleDelete = async () => {
    if (user && user._id) {
      await deleteNotifications(user._id)
      refetch()
    }
  }

  const handleNotificationClick = async (_notificationId: string) => {
    if (user && user._id) {
      markReadMutation.mutate(user._id, {
        onSuccess: () => refetch()
      })
    }
  }

  useEffect(() => {
    socketId.on('notification', (_id) => {
      refetch()
    })
  }, [refetch])
  const popoverContent = (
    <div className='w-96 max-w-sm'>
      <div className='text-gray-600 p-2 px-3 font-medium'>
        {t('newNotification')}
      </div>
      <div className='max-h-80 overflow-auto'>
        {list.length === 0 ? (
          <Empty
            description={t('noneNotification')}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className='py-8'
          />
        ) : (
          list.map((l) => (
            <Link
              key={l._id}
              onClick={() => handleNotificationClick(l._id)}
              to={
                navFor === Role.USER
                  ? `/account/order/detail/${l.objectId}`
                  : navFor === Role.SELLER
                    ? `/seller/orders/detail/${l.objectId}/${store._id}`
                    : navFor === Role.ADMIN
                      ? '/admin/reports'
                      : '#'
              }
              className={`block p-3 border-t hover:bg-gray-50 transition-colors ${
                l.isRead ? 'bg-gray-50 text-gray-600' : 'bg-white text-gray-900'
              }`}
            >
              <div className='text-sm'>{l.message}</div>
              <div className='text-xs text-gray-500 mt-1'>{l.objectId}</div>
              <div className='flex justify-between items-center mt-2'>
                <span className='text-xs text-blue-600'>
                  {timeAgo(l.createdAt)}
                </span>
                <span className='text-xs text-gray-400'>
                  {humanReadableDate(l.createdAt)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
      {list.length > 0 && (
        <>
          <Divider className='my-0' />
          <div className='p-2'>
            <Button
              type='primary'
              danger
              icon={<DeleteOutlined />}
              className='w-full'
              onClick={handleDelete}
            >
              {t('deleteAll')}
            </Button>
          </div>
        </>
      )}
    </div>
  )

  return (
    <Popover
      content={popoverContent}
      title={null}
      trigger='click'
      placement='bottomRight'
      arrow={false}
      onOpenChange={() => refetch()}
    >
      <Badge
        count={notificationCount > 100 ? '99+' : notificationCount}
        size='small'
      >
        <Button
          type='text'
          icon={<BellOutlined />}
          className={` ${navFor === Role.ADMIN ? '' : 'text-white'} hover:bg-white hover:text-blue-600`}
        />
      </Badge>
    </Popover>
  )
}

export default NotificationButton
