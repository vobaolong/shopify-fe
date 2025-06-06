import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getToken } from '../../apis/auth.api'
import { getStoresByUser } from '../../apis/store.api'
import StoreSmallCard from '../card/StoreSmallCard'
import ManagerRoleLabel from '../label/ManagerRoleLabel'
import StoreActiveLabel from '../label/StoreActiveLabel'
import StoreStatusLabel from '../label/StoreStatusLabel'
import SearchInput from '../ui/SearchInput'
import UserCreateStoreForm from '../item/form/UserCreateStoreForm'
import { Alert, Table, Button, Typography, Empty, Divider, Drawer } from 'antd'
import { PlusOutlined, EyeOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { useTranslation } from 'react-i18next'
import { formatDate } from '../../helper/humanReadable'

const UserStoresTable = () => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false)

  const [filter, setFilter] = useState({
    search: '',
    sortBy: 'point',
    sortMoreBy: 'rating',
    order: 'desc',
    limit: 8,
    page: 1
  })
  const [pendingFilter, setPendingFilter] = useState(filter)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['userStores', _id, filter],
    queryFn: () => getStoresByUser(_id, filter),
    select: (response) => {
      if (response.error) {
        throw new Error(response.error)
      }
      return {
        stores: response.stores || [],
        pagination: {
          size: response.size || 0,
          pageCurrent: response.filter?.pageCurrent || 1,
          pageCount: response.filter?.pageCount || 1
        }
      }
    }
  })

  const stores = data?.stores || []
  const pagination = data?.pagination || {
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  }

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
  }

  const handleTableChange = (
    paginationInfo: any,
    _filters: any,
    sorter: any
  ) => {
    const newFilter = {
      ...filter,
      page: paginationInfo.current || 1,
      limit: paginationInfo.pageSize || 8
    }

    if (sorter.order) {
      newFilter.sortBy = sorter.field
      newFilter.order = sorter.order === 'ascend' ? 'asc' : 'desc'
    }

    setFilter(newFilter)
  }
  const columns: ColumnsType<any> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) =>
        index + 1 + (pagination.pageCurrent - 1) * filter.limit
    },
    {
      title: t('storeDetail.storeName'),
      key: 'name',
      render: (_, store) => <StoreSmallCard store={store} />
    },
    {
      title: t('storeDetail.role'),
      key: 'role',
      render: (_, store) => (
        <ManagerRoleLabel
          role={_id === store.ownerId?._id ? 'owner' : 'staff'}
        />
      )
    },
    {
      title: t('status.active'),
      key: 'isActive',
      render: (_, store) => <StoreActiveLabel isActive={store.isActive} />
    },
    {
      title: t('status.status'),
      key: 'isOpen',
      render: (_, store) => <StoreStatusLabel isOpen={store.isOpen} />
    },
    {
      title: t('joined'),
      key: 'createdAt',
      sorter: true,
      render: (_, store) => <span>{formatDate(store.createdAt)}</span>
    },
    {
      title: t('action'),
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, store) => (
        <Link to={`/seller/${store._id}`}>
          <Button
            type='primary'
            size='small'
            icon={<EyeOutlined />}
            title={t('storeDetail.manage')}
          >
            <span className='hidden sm:inline'>{t('storeDetail.manage')}</span>
          </Button>
        </Link>
      )
    }
  ]
  return (
    <div className='relative'>
      {error && (
        <Alert
          message={error.message || 'Server Error'}
          type='error'
          showIcon
          className='mb-4'
        />
      )}
      <div className='p-4 bg-white rounded-lg shadow-sm'>
        <div className='flex gap-3 items-center justify-between mb-4'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
          />
          <Button
            type='primary'
            icon={<PlusOutlined />}
            className='flex items-center'
            onClick={() => setIsCreateDrawerOpen(true)}
          >
            <span className='hidden sm:inline ml-1'>{t('createStore')}</span>
          </Button>
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={stores}
          loading={isLoading}
          onChange={handleTableChange}
          rowKey='_id'
          scroll={{ x: 800 }}
          size='middle'
          pagination={{
            current: pagination.pageCurrent,
            pageSize: filter.limit,
            total: pagination.size,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`,
            pageSizeOptions: ['8', '16', '24', '32']
          }}
          locale={{
            emptyText: (
              <Empty
                description={
                  <p className='text-gray-500 text-lg font-medium'>
                    {t('storeDetail.noStores')}
                  </p>
                }
              ></Empty>
            )
          }}
        />
      </div>{' '}
      {/* Create Store Drawer */}
      <Drawer
        title={t('storeDetail.createStoreTitle')}
        placement='right'
        onClose={() => setIsCreateDrawerOpen(false)}
        open={isCreateDrawerOpen}
        width={600}
        maskClosable={true}
        destroyOnHidden={true}
        closable={true}
        zIndex={9999}
      >
        <UserCreateStoreForm
          onSuccess={() => {
            setIsCreateDrawerOpen(false)
            refetch()
          }}
        />
      </Drawer>
    </div>
  )
}

export default UserStoresTable
