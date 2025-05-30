import { useQuery } from '@tanstack/react-query'
import { listUserForAdmin } from '../../apis/user.api'
import { humanReadableDate } from '../../helper/humanReadable'
import SearchInput from '../ui/SearchInput'
import UserSmallCard from '../card/UserSmallCard'
import { useTranslation } from 'react-i18next'
import VerifyLabel from '../label/VerifyLabel'
import { useState } from 'react'
import {
  Table,
  DatePicker,
  Button,
  Alert,
  Select,
  Typography,
  Divider
} from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import { SyncOutlined } from '@ant-design/icons'
import { UserType } from '../../@types/entity.types'
import { ColumnsType } from 'antd/es/table'
import { PaginationType } from '../../@types/pagination.type'

export interface Filter {
  search?: string
  sortBy: string
  role?: string
  order: string
  limit: number
  page: number
  createdAtFrom?: string
  createdAtTo?: string
  isEmailActive?: boolean
  searchField?: string
  isActive?: boolean
  commissionId?: string
  rating?: string
}

const AdminUsersTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>({
    search: '',
    sortBy: 'createdAt',
    role: 'customer',
    order: 'asc',
    limit: 10,
    page: 1
  })
  const [pendingFilter, setPendingFilter] = useState<Filter>(filter)
  const [dateRange, setDateRange] = useState<any>(null)
  const [searchField, setSearchField] = useState<string>('name')
  const [kycFilter, setKycFilter] = useState<string>('all')

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', filter],
    queryFn: () => listUserForAdmin(filter)
  })

  const users: UserType[] = data?.users || []
  const pagination: PaginationType = {
    size: data?.size || 0,
    pageCurrent: data?.filter?.pageCurrent || filter.page,
    pageCount: data?.filter?.pageCount || 1
  }

  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleDateRangeChange: RangePickerProps['onChange'] = (
    dates,
    dateStrings
  ) => {
    setDateRange(dates)
    setPendingFilter({
      ...pendingFilter,
      createdAtFrom: dateStrings[0] || undefined,
      createdAtTo: dateStrings[1] || undefined,
      page: 1
    })
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter, searchField })
  }

  const handleChangePage = (page: number, pageSize?: number) => {
    setFilter({
      ...filter,
      page,
      limit: pageSize || filter.limit
    })
  }

  const handleSearchFieldChange = (field: string) => {
    setSearchField(field)
  }

  const handleKycChange = (value: string) => {
    setKycFilter(value)
    setPendingFilter({
      ...pendingFilter,
      isEmailActive:
        value === 'all' ? undefined : value === 'isEmailActive' ? true : false
    })
  }

  const columns: ColumnsType<UserType> = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      render: (_: any, __: any, idx: number) =>
        (pagination.pageCurrent - 1) * filter.limit + idx + 1,
      width: 60
    },
    {
      title: t('userDetail.userName'),
      dataIndex: 'userName',
      key: 'userName',
      render: (_: any, user: UserType) => <UserSmallCard user={user} />
    },
    {
      title: t('userDetail.email'),
      dataIndex: 'email',
      key: 'email',
      render: (email: string) => email || '-'
    },
    {
      title: t('userDetail.phone'),
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-'
    },
    {
      align: 'center',
      title: t('point'),
      dataIndex: 'point',
      key: 'point',
      sorter: (a: UserType, b: UserType) =>
        Number(a.point || 0) - Number(b.point || 0)
    },
    {
      title: t('userDetail.idCard'),
      dataIndex: 'id_card',
      key: 'id_card',
      render: (id_card: string) => id_card || '-'
    },
    {
      title: t('userDetail.KYC'),
      dataIndex: 'isEmailActive',
      key: 'isEmailActive',
      render: (isEmailActive: boolean) => <VerifyLabel verify={isEmailActive} />
    },
    {
      title: t('joined'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (createdAt: string) => (
        <span className='text-nowrap'>{humanReadableDate(createdAt)}</span>
      )
    }
  ]

  return (
    <div className='w-full'>
      {heading && (
        <Typography.Title level={5}>{t('title.userInSystem')}</Typography.Title>
      )}
      {error && <Alert message={error.message} type='error' />}
      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-4 items-center flex-wrap'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
            loading={isLoading}
            searchField={searchField}
            onFieldChange={handleSearchFieldChange}
            fieldOptions={[
              { label: t('userDetail.name'), value: 'name' },
              { label: t('userDetail.email'), value: 'email' },
              { label: t('userDetail.phone'), value: 'phone' }
            ]}
          />
          <DatePicker.RangePicker
            value={dateRange}
            onChange={handleDateRangeChange}
            format='YYYY-MM-DD'
            allowClear
          />
          <Select
            style={{ minWidth: 120 }}
            value={kycFilter}
            onChange={handleKycChange}
            options={[
              { label: t('filters.all'), value: 'all' },
              { label: t('status.verified'), value: 'isEmailActive' },
              { label: t('status.notVerified'), value: '!isEmailActive' }
            ]}
            styles={{ popup: { root: { width: 150 } } }}
          />

          <Button type='primary' onClick={handleSearch}>
            {t('search')}
          </Button>
          <Button
            onClick={() => refetch()}
            className='!h-10 !w-10 flex items-center justify-center'
            type='default'
            loading={isLoading}
            icon={<SyncOutlined spin={isLoading} />}
          />
        </div>
        <Divider />
        <Table
          columns={columns}
          dataSource={users}
          rowKey='_id'
          loading={isLoading}
          pagination={{
            current: data?.filter?.pageCurrent || 1,
            pageSize: filter.limit,
            total: data?.size || 0,
            onChange: handleChangePage,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t('of')} ${total} ${t('result')}`
          }}
          scroll={{ x: 'max-content' }}
          size='small'
        />
      </div>
    </div>
  )
}

export default AdminUsersTable
