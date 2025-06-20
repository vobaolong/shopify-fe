import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getToken } from '../../apis/auth.api'
import { listFollowingStores } from '../../apis/followStore.api'
import {
  Spin,
  Alert,
  Row,
  Col,
  Card,
  Empty,
  Pagination as AntPagination
} from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import StoreCard from '../card/StoreCard'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import boxImg from '../../assets/box.svg'

const FollowingCollection = ({ heading = false }) => {
  const { t } = useTranslation()
  const [refreshKey, setRefreshKey] = useState(0)
  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'name',
    order: 'desc',
    limit: 8,
    page: 1
  })

  const { _id } = getToken()

  // Use TanStack Query for data fetching
  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['followingStores', _id, filter, refreshKey],
    queryFn: async () => {
      if (!_id)
        return { stores: [], size: 0, filter: { pageCurrent: 1, pageCount: 1 } }
      const result = await listFollowingStores(_id, filter)
      return result.data
    },
    enabled: !!_id,
    retry: 1,
    staleTime: 30000
  })

  const stores = response?.stores || []
  const pagination = {
    size: response?.size || 0,
    pageCurrent: response?.filter?.pageCurrent || 1,
    pageCount: response?.filter?.pageCount || 1
  }

  // Error message handling
  let errorMessage = ''
  if (error) {
    errorMessage =
      typeof error === 'string' ? error : error?.message || 'Server Error'
  } else if (response?.error) {
    errorMessage =
      typeof response.error === 'string'
        ? response.error
        : response.error?.message || 'Error occurred'
  }

  const handleChangePage = (newPage: number) => {
    setFilter((prev) => ({
      ...prev,
      page: newPage
    }))
  }
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    refetch()
  }

  return (
    <div className='relative'>
      {isLoading && (
        <div className='flex justify-center items-center py-8'>
          <Spin size='large' />
        </div>
      )}

      {errorMessage && (
        <Alert message={errorMessage} type='error' showIcon className='mb-4' />
      )}

      {heading && (
        <Card className='mb-4 text-center'>
          <h4 className='flex items-center justify-center gap-2 m-0'>
            <HeartOutlined className='text-red-500' />
            {t('favStore')}
          </h4>
        </Card>
      )}

      <Card className='shadow-sm'>
        {!isLoading && pagination.size === 0 ? (
          <Empty
            image={boxImg}
            imageStyle={{
              height: 80,
              width: 80,
              margin: '0 auto'
            }}
            description={
              <div className='text-center'>
                <h5 className='text-gray-600 mt-4'>{t('noFavStore')}</h5>
              </div>
            }
            className='py-8'
          />
        ) : (
          <>
            <Row gutter={[16, 16]} className='mb-4'>
              {stores?.map((store: any, index: number) => (
                <Col key={index} xs={12} sm={8} md={6} lg={4} xl={3}>
                  <StoreCard store={store} onRun={handleRefresh} />
                </Col>
              ))}
            </Row>

            {pagination.size > 0 && (
              <div className='flex justify-between items-center pt-4 border-t'>
                <ShowResult
                  limit={filter.limit}
                  size={pagination.size}
                  pageCurrent={pagination.pageCurrent}
                />

                <AntPagination
                  current={pagination.pageCurrent}
                  total={pagination.size}
                  pageSize={filter.limit}
                  onChange={handleChangePage}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} stores`
                  }
                  size='small'
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  )
}

export default FollowingCollection
