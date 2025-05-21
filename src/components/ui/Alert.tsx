import React, { memo, ReactNode } from 'react'

interface AlertProps {
  icon?: ReactNode
  msg1?: string
  alert?: ReactNode
  msg2?: string
  onClose?: () => void
}

const Alert = memo(({ icon, msg1, alert, msg2, onClose }: AlertProps) => {
  return (
    <div className='bg-primary-rgba p-1 px-3 rounded-1 border-rgba d-flex align-items-center justify-content-between my-2'>
      <span>{icon}</span>
      <span className='d-flex gap-1 fs-9 flex-grow-1 ms-2'>
        <b>{msg1}:</b>
        {alert}
        <b>{msg2}</b>
      </span>
      <small className='pointer text-primary' onClick={onClose}>
        Đã hiểu
      </small>
    </div>
  )
})

export default Alert
