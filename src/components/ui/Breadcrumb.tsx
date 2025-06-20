import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

export interface BreadcrumbPath {
  name: string
  url: string
}

interface BreadcrumbProps {
  paths: BreadcrumbPath[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  if (!Array.isArray(paths) || paths.length === 0) {
    return null
  }

  const breadcrumbItems = paths.map((path, index) => {
    const isLast = index === paths.length - 1
    const isFirst = index === 0

    return {
      key: index,
      title: isLast ? (
        <span className='text-gray-600 font-medium'>{path.name}</span>
      ) : (
        <Link to={path.url} className='!no-underline'>
          {isFirst ? (
            <span className='flex items-center gap-1'>
              <HomeOutlined />
              {path.name}
            </span>
          ) : (
            path.name
          )}
        </Link>
      )
    }
  })

  return (
    <AntBreadcrumb
      items={breadcrumbItems}
      separator='/'
      className='text-sm py-2'
    />
  )
}

export default Breadcrumb
