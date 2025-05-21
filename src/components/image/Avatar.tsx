import React, { useState } from 'react'
import defaultImage from '../../assets/default.webp'
import ProductUpload from './uploadButton/ProductUpload'
import UserAvatarUpload from './uploadButton/UserAvatarUpload'
import StoreAvatarUpload from './uploadButton/StoreAvatarUpload'

interface AvatarProps {
  storeId?: string
  productId?: string
  productIndex?: number | string
  avatar?: string
  name?: string
  alt?: string
  borderName?: boolean
  isEditable?: 'user' | 'store' | 'product' | false
  size?: string
  noRadius?: boolean
  onRun?: () => void
  hide?: boolean
  status?: string
}

const Avatar: React.FC<AvatarProps> = ({
  storeId = '',
  productId = '',
  productIndex = '',
  avatar = '',
  name = '',
  alt = 'avatar',
  borderName = false,
  isEditable = false,
  size = '',
  noRadius = false,
  onRun = () => {},
  hide = false,
  status = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className='cus-avatar-wrap'>
      <div className={`cus-avatar-box ${size && 'cus-avatar-box--small'}`}>
        <div
          className='cus-avatar'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            loading='lazy'
            src={avatar ? avatar : defaultImage}
            className='cus-avatar-img'
            style={{ borderRadius: `${noRadius && '5px'}` }}
            alt={alt}
          />

          {isHovered && isEditable === 'user' && <UserAvatarUpload />}
          {isHovered && isEditable === 'store' && (
            <StoreAvatarUpload storeId={storeId} />
          )}
          {isHovered && isEditable === 'product' && (
            <ProductUpload
              productId={productId}
              index={Number(productIndex)}
              storeId={storeId}
              onRun={onRun}
            />
          )}
        </div>
      </div>
      {(size !== 'small' || !hide) && (
        <div className='d-flex'>
          <h6
            className={`cus-avatar-name m-0 p-1 rounded-1 d-inline-block ${
              borderName && 'bg-value box-shadow'
            }`}
          >
            {name}
          </h6>
          <small className='cus-shop-status'>{status}</small>
        </div>
      )}
    </div>
  )
}

export default Avatar
