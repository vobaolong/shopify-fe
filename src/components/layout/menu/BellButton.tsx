import { useEffect, useState } from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import {
  deleteNotifications,
  getNotifications,
  updateRead
} from '../../../apis/notification.api'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { timeAgo } from '../../../helper/calcTime'
import { humanReadableDate } from '../../../helper/humanReadable'
import { socketId } from '../../../socket'
import { selectAccountUser } from '../../../store/slices/accountSlice'
import { selectSellerStore } from '../../../store/slices/sellerSlice'

interface Notification {
  _id: string
  message: string
  objectId: string
  isRead: boolean
  createdAt: string
}

interface BellButtonProps {
  navFor?: string
}

const BellButton = ({ navFor = '' }: BellButtonProps) => {
  const { t } = useTranslation()
  const [list, setList] = useState<Notification[]>([])
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const [notificationCount, setNotificationCount] = useState<number>(
    list.length
  )

  const handleDelete = async () => {
    try {
      await deleteNotifications(user._id)
      setList([])
    } catch (error) {
      console.log(error)
    }
  }

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await updateRead(user._id)
      setList((prevList) =>
        prevList.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n
        )
      )
    } catch (error) {
      console.log(error)
    }
  }

  const fetchNotifications = async (id: string) => {
    try {
      const res = await getNotifications(id)
      // Support both AxiosResponse and fallback array
      let notifications: Notification[] = []
      let numberHidden = 0
      if (Array.isArray(res)) {
        notifications = []
        numberHidden = 0
      } else if ('data' in res && res.data) {
        notifications = res.data.notifications || []
        numberHidden = res.data.numberHidden || 0
      } else if (!('data' in res)) {
        // Only access these if res is not an AxiosResponse
        notifications = (res as any).notifications || []
        numberHidden = (res as any).numberHidden || 0
      }
      const sortedNotifications = notifications.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setList(sortedNotifications)
      setNotificationCount(numberHidden)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotifications(user._id)
  }, [user])

  useEffect(() => {
    socketId.on('notification', (id) => {
      fetchNotifications(id)
    })
  }, [])

  const popoverClickRootClose = (
    <Popover
      id='popover-trigger-click-root-close'
      style={{
        borderRadius: '5px',
        minWidth: '420px'
      }}
    >
      <div className='text-secondary p-2 px-3'>{t('newNotification')}</div>
      <div
        style={{
          height: '300px',
          overflow: 'auto'
        }}
      >
        {list.map((l) => (
          <Link
            onClick={() => handleNotificationClick(l._id)}
            to={
              navFor === 'user'
                ? `/account/purchase/detail/${l.objectId}`
                : navFor === 'seller'
                  ? `/seller/orders/detail/${l.objectId}/${store._id}`
                  : navFor === 'admin'
                    ? '/admin/reports'
                    : '#'
            }
            key={l._id}
            style={{ fontSize: '14px' }}
            className={`${
              l.isRead ? 'cus-notification-is-read' : 'cus-notification'
            } nolink cus-dropdown w-100 px-3 py-2 border-top`}
          >
            {l.message} <p>{l.objectId}</p>
            <p className='d-flex justify-content-between'>
              <span>{timeAgo(l.createdAt)}</span>
              <small>{humanReadableDate(l.createdAt)}</small>
            </p>
          </Link>
        ))}
        {list.length === 0 && (
          <p className='text-center mt-5 pt-5'>{t('noneNotification')}</p>
        )}
      </div>
      {list.length !== 0 && (
        <>
          <hr className='m-0' />
          <div className='d-flex justify-content-center'>
            <button
              className='btn rounded-0 w-100 btn-primary'
              onClick={handleDelete}
            >
              {t('deleteAll')}
            </button>
          </div>
        </>
      )}
    </Popover>
  )

  return (
    <div onClick={() => setNotificationCount(0)}>
      <OverlayTrigger
        trigger='click'
        rootClose
        placement='bottom'
        overlay={popoverClickRootClose}
      >
        <div className='cart-item-wrap position-relative'>
          <span className='rounded-circle btn inherit cus-tooltip ripple mx-2 bell'>
            <i className='fa-solid fa-bell' />
          </span>
          {notificationCount > 0 && (
            <span
              style={{ top: '20%', left: '80%' }}
              className='position-absolute translate-middle badge rounded-pill bg-danger'
            >
              {notificationCount < 100 ? notificationCount : '99+'}
            </span>
          )}
          <small className='cus-tooltip-msg'>{t('notification')}</small>
        </div>
      </OverlayTrigger>
    </div>
  )
}

export default BellButton
