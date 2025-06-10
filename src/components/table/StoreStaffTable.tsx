/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react'
import { getToken } from '../../apis/auth.api'
import { deleteStaff } from '../../apis/store.api'
import useUpdateDispatch from '../../hooks/useUpdateDispatch'
import UserSmallCard from '../card/UserSmallCard'
import StoreAddStaffItem from '../item/StoreAddStaffItem'
import CancelStaffButton from '../button/CancelStaffButton'
import { Table, Button, Modal, Alert, Spin, Tooltip, Input } from 'antd'
import {
  UserAddOutlined,
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import ShowResult from '../ui/ShowResult'
import { StaffFilterState, defaultStaffFilter } from '../../@types/filter.type'
import boxImg from '../../assets/box.svg'

const StoreStaffTable = ({
  heading = false,
  staffIds = [],
  ownerId = {},
  storeId = ''
}) => {
  const { t } = useTranslation()
  const [deletedStaff, setDeletedStaff] = useState<any>({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const { _id: userId } = getToken()
  const [updateDispatch] = useUpdateDispatch()
  const [alerts, setAlerts] = useState(true)
  const [filter, setFilter] = useState<StaffFilterState>(defaultStaffFilter)
  const [pendingFilter, setPendingFilter] =
    useState<StaffFilterState>(defaultStaffFilter)

  // Local filter logic
  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staffIds) || staffIds.length === 0) return []
    const search = (filter.search || '').toLowerCase()
    return staffIds
      .filter(
        (staff: any) =>
          staff.userName?.toLowerCase().includes(search) ||
          staff.name?.toLowerCase().includes(search)
      )
      .sort(compareFunc(filter.sortBy || 'name', filter.order || 'asc'))
  }, [staffIds, filter])

  const pageSize = filter.limit || 6
  const pageCurrent = filter.page || 1
  const pageCount = Math.ceil(filteredStaff.length / pageSize)
  const pagedStaff = filteredStaff.slice(
    (pageCurrent - 1) * pageSize,
    pageCurrent * pageSize
  )

  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPendingFilter({ ...pendingFilter, search: e.target.value })
  }
  const handleSearch = () => {
    setFilter({ ...pendingFilter, page: 1 })
  }
  const handleChangePage = (page: number) => {
    setFilter({ ...filter, page })
  }
  const handleSetSortBy = (order: string, sortBy: string) => {
    setFilter({ ...filter, sortBy, order: order as 'asc' | 'desc' })
  }
  const handleDeleteStaff = (staff: any) => {
    setDeletedStaff(staff)
    setIsConfirming(true)
  }
  const onDeleteSubmitStaff = async () => {
    setError('')
    setIsLoading(true)
    try {
      const staff = deletedStaff?._id
      const data = await deleteStaff(userId, staff, storeId)
      if (data.error) setError(data.error)
      else {
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.staff.removeStaff'))
      }
    } catch {
      setError('Server Error')
    } finally {
      setIsLoading(false)
      setIsConfirming(false)
      setTimeout(() => setError(''), 3000)
    }
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center' as const,
      width: 50,
      render: (_: any, __: any, idx: number) =>
        idx + 1 + (pageCurrent - 1) * pageSize
    },
    {
      title: t('staffDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => <UserSmallCard user={record} />,
      width: 200
    },
    {
      title: 'ID Card',
      dataIndex: 'id_card',
      key: 'id_card',
      width: 120,
      render: (id_card: string) => id_card || '-'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (email: string) => email || '-'
    },
    {
      title: t('userDetail.phone'),
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (phone: string) => phone || '-'
    },
    ...(ownerId && userId === (ownerId as any)?._id
      ? [
          {
            title: t('action'),
            key: 'action',
            align: 'center' as const,
            render: (_: any, record: any) => (
              <Tooltip title={t('staffDetail.delete')}>
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size='small'
                  onClick={() => handleDeleteStaff(record)}
                />
              </Tooltip>
            )
          }
        ]
      : [])
  ]

  return (
    <div className='relative'>
      {alerts && (
        <Alert
          type='info'
          message={t('alert.listStaff')}
          description={`${t('alert.thisSectionContains')} ${t('alert.theShopStaff.')}`}
          closable
          onClose={() => setAlerts(false)}
          className='mb-2'
        />
      )}
      {isLoading && (
        <div className='flex justify-center p-3'>
          <Spin size='large' />
        </div>
      )}
      {isConfirming && (
        <Modal
          open={isConfirming}
          title={t('staffDetail.delete')}
          onOk={onDeleteSubmitStaff}
          onCancel={() => setIsConfirming(false)}
          okText={t('button.delete')}
          cancelText={t('button.cancel')}
          confirmLoading={isLoading}
        >
          <p>{t('message.removeStaff')}</p>
        </Modal>
      )}
      {heading && <h5 className='text-start'>{t('staffDetail.staffList')}</h5>}
      {error && (
        <Alert message={error} type='error' showIcon className='mb-2' />
      )}
      <div className='p-3 bg-white rounded-md shadow'>
        <div className='flex gap-3 items-center flex-wrap mb-3'>
          <Input
            prefix={<SearchOutlined />}
            placeholder={t('search')}
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onPressEnter={handleSearch}
            className='w-64'
            allowClear
          />
          <Button
            type='primary'
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            {t('search')}
          </Button>
          {ownerId && userId === (ownerId as any)?._id ? (
            <StoreAddStaffItem
              storeId={storeId}
              owner={ownerId}
              staff={staffIds}
            />
          ) : (
            <CancelStaffButton storeId={storeId} />
          )}
        </div>
        {pagedStaff.length === 0 ? (
          <div className='my-4 text-center'>
            <img
              className='mb-3 mx-auto'
              src={boxImg}
              alt='boxImg'
              width={'80px'}
            />
            <h5>{t('staffDetail.noStaff')}</h5>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={pagedStaff}
            rowKey='_id'
            pagination={false}
            className='mb-4'
            scroll={{ x: 'max-content' }}
          />
        )}
        <div className='flex justify-between items-center px-4'>
          <span className='text-gray-500 text-sm'>
            {t('Hiển thị')} {pagedStaff.length} / {filteredStaff.length}
          </span>
          {filteredStaff.length > 0 && (
            <div>
              <Button
                disabled={pageCurrent === 1}
                onClick={() => handleChangePage(pageCurrent - 1)}
                className='mr-2'
              >
                {t('Prev')}
              </Button>
              <span className='mx-2'>
                {pageCurrent} / {pageCount}
              </span>
              <Button
                disabled={pageCurrent === pageCount}
                onClick={() => handleChangePage(pageCurrent + 1)}
              >
                {t('Next')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function compareFunc(sortBy: string, order: string) {
  return (a: any, b: any) => {
    if (!a[sortBy] || !b[sortBy]) return 0
    if (a[sortBy] < b[sortBy]) return order === 'asc' ? -1 : 1
    if (a[sortBy] > b[sortBy]) return order === 'asc' ? 1 : -1
    return 0
  }
}

export default StoreStaffTable
