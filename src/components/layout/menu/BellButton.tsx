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
import {
  useNotifications,
  useMarkNotificationsRead
} from '../../../hooks/useNotification'

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
  const user = useSelector(selectAccountUser)
  const store = useSelector(selectSellerStore)
  const { data, isLoading, refetch } = useNotifications(user?._id)
  const markReadMutation = useMarkNotificationsRead()
  const list: Notification[] = data?.notifications || []
  const notificationCount = data?.numberHidden || list.length

  const handleDelete = async () => {
    try {
      if (user && user._id) {
        await deleteNotifications(user._id)
        refetch()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleNotificationClick = async (notificationId: string) => {
    try {
      if (user && user._id) {
        markReadMutation.mutate(user._id, {
          onSuccess: () => refetch()
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    socketId.on('notification', (id) => {
      refetch()
    })
  }, [refetch])

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
                ? `/account/order/detail/${l.objectId}`
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
            <p className='flex justify-content-between'>
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
          <div className='flex justify-content-center'>
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
    <div onClick={() => refetch()}>
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
