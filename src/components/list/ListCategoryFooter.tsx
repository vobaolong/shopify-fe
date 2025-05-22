/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Link } from 'react-router-dom'
import { listActiveCategories } from '../../apis/category'
import Skeleton from 'react-loading-skeleton'
import { useQuery } from '@tanstack/react-query'
import { notification } from 'antd'

const ListCategoryFooter = ({ category = {} as any }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['categoryChildren', category._id],
    queryFn: () =>
      listActiveCategories({
        search: '',
        categoryId: category._id,
        sortBy: 'name',
        order: 'asc',
        limit: 20,
        page: 1
      }).then((res) => res.data),
    enabled: !!category._id
  })

  if (error) {
    notification.error({ message: error?.message || 'Server Error' })
  }

  const children = data?.categories || []

  return (
    <>
      {category.name ? (
        <Link
          className='link-hover d-flex mt-1 text-start flex-wrap'
          style={{ whiteSpace: 'normal' }}
          to={`/category/${category._id}`}
          title={category.name}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}
            className='text-uppercase text-dark-emphasis'
          >
            {category.name}
          </span>
        </Link>
      ) : (
        <Skeleton />
      )}

      {!isLoading && children?.length > 0 ? (
        <div className='d-flex gap-1 text-secondary flex-wrap'>
          {children.map((child: any, index: number) => (
            <React.Fragment key={index}>
              <Link
                className='text-decoration-none footer-category-child text-secondary'
                to={`/category/${child._id}`}
              >
                <small>{child.name}</small>
              </Link>
              {index < children.length - 1 && (
                <span className='fw-light'>|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <Skeleton count={4} height={20} />
      )}
    </>
  )
}

export default ListCategoryFooter
