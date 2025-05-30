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
  alt?: string
  isEditable?: 'user' | 'store' | 'product' | false
  onRun?: () => void
}

const AvatarComponent: React.FC<AvatarProps> = ({
  storeId = '',
  productId = '',
  productIndex = '',
  avatar = '',
  alt = 'avatar',
  isEditable = false,
  onRun = () => {}
}) => {
  return (
    <div className='relative w-24 h-24'>
      <img
        src={avatar ? avatar : defaultImage}
        className='object-cover w-full h-full border rounded-full'
        alt={alt}
      />
      {isEditable === 'user' && <UserAvatarUpload />}
      {isEditable === 'store' && <StoreAvatarUpload storeId={storeId} />}
      {isEditable === 'product' && (
        <ProductUpload
          productId={productId}
          index={Number(productIndex)}
          storeId={storeId}
          onRun={onRun}
        />
      )}
    </div>
  )
}

export default AvatarComponent
