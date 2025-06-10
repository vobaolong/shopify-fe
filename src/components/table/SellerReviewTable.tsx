import { useState } from 'react'
import { listReviews } from '../../apis/review.api'
import { Spin, Alert, Table } from 'antd'
import Pagination from '../ui/Pagination'
import StarRating from '../label/StarRating'
import { useTranslation } from 'react-i18next'
import { humanReadableDate } from '../../helper/humanReadable'
import ShowResult from '../ui/ShowResult'
import box from '../../assets/box.svg'
import ProductSmallCard from '../card/ProductSmallCard'
import { Modal } from 'antd'
import ListReport from '../item/form/ListReport'
import { useSelector } from 'react-redux'
import { selectAccountUser } from '../../store/slices/accountSlice'
import { useQuery } from '@tanstack/react-query'

const reviewReasons = [
  {
    value: 'Đánh giá không chính xác/ gây hiểu lầm',
    label: 'Đánh giá không chính xác/ gây hiểu lầm'
  },
  {
    value: 'Đánh giá trùng lặp (thông tin rác)',
    label: 'Đánh giá trùng lặp (thông tin rác)'
  },
  {
    value: 'Đánh giá sử dụng ngôn từ không phù hợp',
    label: 'Đánh giá sử dụng ngôn từ không phù hợp'
  },
  {
    value: 'Đánh giá chứa quảng cáo trái phép, lừa đảo Người mua khác',
    label: 'Đánh giá chứa quảng cáo trái phép, lừa đảo Người mua khác'
  },
  {
    value: 'Chia sẻ thông tin cá nhân',
    label: 'Chia sẻ thông tin cá nhân'
  }
]

const SellerReviewTable = ({
  productId = '',
  storeId = '',
  userId = '',
  rating = 0
}) => {
  const { t } = useTranslation()
  const [error] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const user = useSelector(selectAccountUser)
  const [filter, setFilter] = useState({
    productId,
    storeId,
    userId,
    rating: rating,
    sortBy: 'createdAt',
    order: 'desc',
    limit: 7,
    page: 1
  })

  const {
    data,
    isLoading: queryLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['reviews', filter],
    queryFn: async () => {
      const res = await listReviews(filter)
      return res.data || res
    }
  })

  const reviews = data?.reviews || []
  const pagination = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || 1,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleReportClick = (review: any) => {
    setSelectedReview(review)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setSelectedReview(null)
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const columns = [
    {
      title: '#',
      dataIndex: '',
      key: 'index',
      width: '5%',
      render: (_: any, __: any, index: number) => (
        <span>{index + 1 + (filter.page - 1) * filter.limit}</span>
      )
    },
    {
      title: t('productDetail.name'),
      dataIndex: 'productId',
      key: 'productId',
      width: '20%',
      render: (productId: any) => (
        <small>
          <ProductSmallCard product={productId} />
        </small>
      )
    },
    {
      title: t('Rating'),
      dataIndex: 'rating',
      key: 'rating',
      width: '10%',
      render: (rating: number) => <StarRating stars={rating} />
    },
    {
      title: t('reviewDetail.content'),
      dataIndex: 'content',
      key: 'content',
      width: '40%',
      render: (content: string) => (
        <div
          style={{
            width: '400px',
            maxWidth: '400px',
            minWidth: '400px',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            overflow: 'auto'
          }}
        >
          {content}
        </div>
      )
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '15%',
      render: (createdAt: string) => humanReadableDate(createdAt)
    },
    {
      title: t('action'),
      key: 'action',
      width: '10%',
      render: (_: any, record: any) => (
        <>
          <button
            type='button'
            onClick={() => handleReportClick(record)}
            className='btn btn-sm btn-warning'
          >
            {t('button.complaint')}
          </button>
          <Modal
            title={t('dialog.complaint')}
            open={modalVisible && selectedReview?._id === record._id}
            onCancel={handleModalClose}
            footer={null}
            closable
          >
            <ListReport
              reasons={reviewReasons}
              objectId={record._id || ''}
              reportBy={user._id || ''}
              isStore={false}
              isProduct={false}
              isReview={true}
              showOtherReason={true}
            />
          </Modal>
        </>
      )
    }
  ]

  return (
    <div>
      {queryLoading && <Spin size='large' />}
      {isError && <Alert message={error} type='error' />}
      <Table
        columns={columns}
        dataSource={reviews}
        rowKey='_id'
        pagination={pagination}
        className='mb-4'
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default SellerReviewTable
