import { useState, useEffect } from 'react'
import { Table, Button, Modal, Space, Tag, message, Empty, Spin } from 'antd'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  StarFilled
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { humanReadableDate } from '../../helper/humanReadable'
import { useReviews, useDeleteReviewByAdmin } from '../../hooks/useReview'
import { ReviewType } from '../../@types/entity.types'
import { PaginationType } from '../../@types/pagination.type'
import ProductSmallCard from '../card/ProductSmallCard'

interface AdminReviewTableProps {
  productId?: string
  storeId?: string
  userId?: string
  rating?: number
}

const AdminReviewTable = ({
  productId = '',
  storeId = '',
  userId = '',
  rating
}: AdminReviewTableProps) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState({
    productId,
    storeId,
    userId,
    rating: rating === 0 ? '' : rating,
    sortBy: 'createdAt',
    order: 'desc',
    limit: 10,
    page: 1
  })

  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      rating: rating === 0 ? '' : rating,
      storeId
    }))
  }, [rating, storeId])

  const { data, isLoading, error, refetch } = useReviews(filter)
  const deleteReviewMutation = useDeleteReviewByAdmin()
  const reviews: ReviewType[] = data?.data?.reviews || []
  const pagination: PaginationType = {
    size: data?.data?.size || 0,
    pageCurrent: data?.data?.pageCurrent || 1,
    pageCount: data?.data?.pageCount || 1
  }

  const handleDeleteReview = (review: ReviewType) => {
    Modal.confirm({
      title: t('dialog.deleteReview'),
      icon: <ExclamationCircleOutlined />,
      content: t('message.delete'),
      okText: t('button.delete'),
      okType: 'danger',
      cancelText: t('button.cancel'),
      onOk: () => {
        deleteReviewMutation.mutate(
          { reviewId: review._id },
          {
            onSuccess: () => {
              message.success(t('toastSuccess.review.delete'))
              refetch()
            },
            onError: () => {
              message.error('Server Error')
            }
          }
        )
      }
    })
  }

  const handleTableChange = (
    paginationConfig: any,
    filters: any,
    sorter: any
  ) => {
    setFilter((prev) => ({
      ...prev,
      page: paginationConfig.current,
      limit: paginationConfig.pageSize,
      sortBy: sorter.field || 'createdAt',
      order: sorter.order === 'ascend' ? 'asc' : 'desc'
    }))
  }

  const StarRating = ({ stars }: { stars: number }) => (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarFilled
          key={star}
          className={`text-sm ${star <= stars ? 'text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) =>
        index + 1 + (filter.page - 1) * filter.limit,
      className: 'text-center'
    },
    {
      title: t('productDetail.name'),
      key: 'product',
      width: 300,
      render: (record: ReviewType) => (
        <div className='min-w-0'>
          <ProductSmallCard product={record.productId as any} />
        </div>
      )
    },
    {
      title: t('Rating'),
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      sorter: true,
      render: (rating: number) => <StarRating stars={rating} />
    },
    {
      title: t('reviewDetail.content'),
      dataIndex: 'content',
      key: 'content',
      width: 400,
      render: (content: string) => (
        <div className='max-w-sm break-words whitespace-normal overflow-hidden'>
          {content}
        </div>
      )
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      sorter: true,
      render: (date: string) => humanReadableDate(date)
    },
    {
      title: t('action'),
      key: 'actions',
      width: 100,
      render: (record: ReviewType) => (
        <Space>
          <Button
            type='primary'
            danger
            size='small'
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteReview(record)}
            loading={deleteReviewMutation.isPending}
          >
            {t('button.delete')}
          </Button>
        </Space>
      )
    }
  ]

  if (error) {
    message.error(error.message || 'Server Error')
  }

  return (
    <div className='relative'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <Table
          columns={columns}
          dataSource={reviews}
          rowKey='_id'
          loading={isLoading || deleteReviewMutation.isPending}
          pagination={{
            current: pagination.pageCurrent,
            pageSize: filter.limit,
            total: pagination.size,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('items')}`,
            pageSizeOptions: ['5', '10', '20', '50']
          }}
          onChange={handleTableChange}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('reviewDetail.noReview')}
              />
            )
          }}
          scroll={{ x: 800 }}
          className='w-full'
        />
      </div>
    </div>
  )
}

export default AdminReviewTable
