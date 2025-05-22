import { useQuery } from '@tanstack/react-query'
import { listUserForAdmin } from '../../apis/user'
import { humanReadableDate } from '../../helper/humanReadable'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import SortByButton from './sub/SortByButton'
import UserSmallCard from '../card/UserSmallCard'
import Loading from '../ui/Loading'
import { useTranslation } from 'react-i18next'
import VerifyLabel from '../label/VerifyLabel'
import ShowResult from '../ui/ShowResult'
import Error from '../ui/Error'
import { useState } from 'react'
import { notification, Table } from 'antd'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  isEmailActive: boolean
  isPhoneActive: boolean
  role: string
  addresses: string[]
  avatar: string
  cover: string
  e_wallet: {
    $numberDecimal: string
  }
  point: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  slug: string
  id_card?: string
  phone?: string
}

interface Filter {
  search: string
  sortBy: string
  role: string
  order: string
  limit: number
  page: number
}

const AdminUsersTable = ({ heading = false }) => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>({
    search: '',
    sortBy: 'createdAt',
    role: 'customer',
    order: 'asc',
    limit: 8,
    page: 1
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filter],
    queryFn: async () => {
      return await listUserForAdmin(filter)
    }
  })

  const handleChangeKeyword = (keyword: string) => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }

  const handleChangePage = (page: number, pageSize?: number) => {
    setFilter({
      ...filter,
      page,
      limit: pageSize || filter.limit
    })
  }

  // Định nghĩa columns cho antd Table
  const columns = [
    {
      title: t('userDetail.name'),
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_: any, user: User) => <UserSmallCard user={user} />
    },
    {
      title: t('point'),
      dataIndex: 'point',
      key: 'point'
    },
    {
      title: 'ID Card',
      dataIndex: 'id_card',
      key: 'id_card',
      render: (id_card: string) => id_card || '-'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: t('userDetail.KYC'),
      dataIndex: 'isEmailActive',
      key: 'isEmailActive',
      render: (isEmailActive: boolean) => <VerifyLabel verify={isEmailActive} />
    },
    {
      title: t('userDetail.phone'),
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => phone || '-'
    },
    {
      title: t('joined'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => humanReadableDate(createdAt)
    }
  ]

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {heading && <h5 className='text-start'>{t('title.userInSystem')}</h5>}
      {error && <Error msg={error.message} />}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className='mb-3'>
          <SearchInput onChange={handleChangeKeyword} />
        </div>
        <Table
          columns={columns}
          dataSource={data?.users || []}
          rowKey='_id'
          loading={isLoading}
          pagination={{
            current: data?.filter?.pageCurrent || 1,
            pageSize: filter.limit,
            total: data?.size || 0,
            onChange: handleChangePage
          }}
        />
        <div className='d-flex justify-content-between align-items-center px-4'>
          <ShowResult
            limit={filter.limit}
            size={data?.size || 0}
            pageCurrent={data?.filter?.pageCurrent || 1}
          />
        </div>
      </div>
    </div>
  )
}

export default AdminUsersTable
