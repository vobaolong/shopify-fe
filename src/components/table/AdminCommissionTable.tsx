import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth'
import {
  listCommissions,
  removeCommission,
  restoreCommission
} from '../../apis/commission'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import StoreCommissionLabel from '../label/StoreCommissionLabel'
import DeletedLabel from '../label/DeletedLabel'
import ActiveLabel from '../label/ActiveLabel'
import AdminCreateCommissionItem from '../item/AdminCreateCommissionItem'
import AdminEditCommissionForm from '../item/form/AdminEditCommissionForm'
import Modal from '../ui/Modal'
import Loading from '../ui/Loading'
import ConfirmDialog from '../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import ShowResult from '../ui/ShowResult'
import { toast } from 'react-toastify'
import Error from '../ui/Error'
import { humanReadableDate } from '../../helper/humanReadable'
import boxImg from '../../assets/box.svg'
import { Table } from 'antd'
import { CommissionType, ApiResponse } from '../../@types/entity.types'

interface Pagination {
  size: number
  pageCurrent: number
  pageCount: number
}

interface Filter {
  search: string
  sortBy: string
  order: string
  limit: number
  page: number
}

interface CommissionTableType extends CommissionType {
  isDeleted?: boolean
  fee?: { $numberDecimal: number }
}

const AdminCommissionTable = ({ heading = false }: { heading?: boolean }) => {
  const { t } = useTranslation()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isConfirming, setIsConfirming] = useState<boolean>(false)
  const [isConfirmingRestore, setIsConfirmingRestore] = useState<boolean>(false)
  const [run, setRun] = useState<boolean>(false)
  const [editedCommission, setEditedCommission] =
    useState<CommissionTableType | null>(null)
  const [deletedCommission, setDeletedCommission] =
    useState<CommissionTableType | null>(null)
  const [restoredCommission, setRestoredCommission] =
    useState<CommissionTableType | null>(null)
  const [commissions, setCommissions] = useState<CommissionTableType[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  })
  const [filter, setFilter] = useState<Filter>({
    search: '',
    sortBy: 'name',
    order: 'asc',
    limit: 10,
    page: 1
  })

  const { _id } = getToken() || {}

  const init = () => {
    setError('')
    setIsLoading(true)
    listCommissions(filter)
      .then((res) => {
        const data = res.data
        if (data.error) setError(data.error)
        else {
          setCommissions(data.commissions || [])
          setPagination({
            size: data.size || 0,
            pageCurrent: data.filter?.pageCurrent || 1,
            pageCount: data.filter?.pageCount || 1
          })
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, run])

  const handleChangeKeyword = (keyword: string) => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }

  const handleChangePage = (newPage: number) => {
    setFilter({
      ...filter,
      page: newPage
    })
  }

  const handleSetSortBy = (order: string, sortBy: string) => {
    setFilter({
      ...filter,
      sortBy,
      order
    })
  }

  const handleEditCommission = (commission: CommissionTableType) => {
    setEditedCommission(commission)
  }

  const handleRemoveCommission = (commission: CommissionTableType) => {
    setDeletedCommission(commission)
    setIsConfirming(true)
  }

  const handleRestoreCommission = (commission: CommissionTableType) => {
    setRestoredCommission(commission)
    setIsConfirmingRestore(true)
  }

  const onSubmitDelete = () => {
    if (!deletedCommission) return
    setError('')
    setIsLoading(true)
    removeCommission(deletedCommission._id)
      .then((res) => {
        const data = res.data
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.commission.delete'))
          setRun((prev) => !prev)
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  const onSubmitRestore = () => {
    if (!restoredCommission) return
    setError('')
    setIsLoading(true)
    restoreCommission(restoredCommission._id)
      .then((res) => {
        const data = res.data
        if (data.error) setError(data.error)
        else {
          toast.success(t('toastSuccess.commission.restore'))
          setRun((prev) => !prev)
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) =>
        index + 1 + (filter.page - 1) * filter.limit,
      width: 50
    },
    {
      title: t('commissionDetail.name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: CommissionTableType) => (
        <StoreCommissionLabel commission={record} />
      )
    },
    {
      title: t('commissionDetail.fee'),
      dataIndex: 'fee',
      key: 'fee',
      render: (fee: any) =>
        fee?.$numberDecimal ? `${fee.$numberDecimal}%` : '-'
    },
    {
      title: t('commissionDetail.description'),
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => (
        <span style={{ width: 300, overflow: 'auto', display: 'inline-block' }}>
          {desc}
        </span>
      )
    },
    {
      title: t('status.status'),
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      render: (isDeleted: boolean) =>
        isDeleted ? <DeletedLabel /> : <ActiveLabel />
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => humanReadableDate(date)
    },
    {
      title: t('action'),
      key: 'action',
      render: (_: any, commission: CommissionTableType) => (
        <div className='py-1'>
          <div className='position-relative d-inline-block'>
            <button
              type='button'
              className='btn btn-sm btn-outline-primary ripple me-2 rounded-1 cus-tooltip'
              data-bs-toggle='modal'
              data-bs-target='#edit-commission-form'
              onClick={() => handleEditCommission(commission)}
              title={t('button.edit')}
            >
              <i className='fa-duotone fa-pen-to-square'></i>
            </button>
            <span className='cus-tooltip-msg'>{t('button.edit')}</span>
          </div>
          <div className='position-relative d-inline-block'>
            {!commission.isDeleted ? (
              <button
                type='button'
                className='btn btn-sm btn-outline-danger ripple rounded-1 cus-tooltip'
                onClick={() => handleRemoveCommission(commission)}
              >
                <i className='fa-solid fa-trash-alt'></i>
              </button>
            ) : (
              <button
                type='button'
                className='btn btn-sm btn-outline-success ripple rounded-1 cus-tooltip'
                onClick={() => handleRestoreCommission(commission)}
              >
                <i className='fa-solid fa-trash-can-arrow-up'></i>
              </button>
            )}
            <span className='cus-tooltip-msg'>
              {!commission.isDeleted ? t('button.delete') : t('button.restore')}
            </span>
          </div>
        </div>
      )
    }
  ]

  const dataSource = commissions.map((commission, idx) => ({
    ...commission,
    key: commission._id || idx
  }))

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      {isConfirming && deletedCommission && (
        <ConfirmDialog
          title={t('dialog.removeCommission')}
          message={t('message.delete')}
          color='danger'
          onSubmit={onSubmitDelete}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {isConfirmingRestore && restoredCommission && (
        <ConfirmDialog
          title={t('dialog.restoreCommission')}
          message={t('message.restore')}
          onSubmit={onSubmitRestore}
          onClose={() => setIsConfirmingRestore(false)}
        />
      )}

      {heading && <h5 className='text-start'>{t('admin.commissions')}</h5>}
      {isLoading && <Loading />}
      {error && <Error msg={error} />}

      <div className='p-3 box-shadow bg-body rounded-2'>
        <div className=' d-flex align-items-center justify-content-between mb-3'>
          <SearchInput onChange={handleChangeKeyword} />
          <AdminCreateCommissionItem onRun={() => setRun((prev) => !prev)} />
        </div>
        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={boxImg} alt='noItem' width={'100px'} />
            <h5>{t('levelDetail.none')}</h5>
          </div>
        ) : (
          <>
            <Table
              columns={columns}
              dataSource={dataSource}
              loading={isLoading}
              pagination={false}
            />

            <Modal
              id='edit-commission-form'
              hasCloseBtn={false}
              title={t('commissionDetail.edit')}
            >
              <AdminEditCommissionForm
                oldCommission={editedCommission || undefined}
                onRun={() => setRun((prev) => !prev)}
              />
            </Modal>
            <div className='d-flex align-items-center justify-content-between px-4'>
              <ShowResult
                limit={filter.limit}
                size={pagination.size}
                pageCurrent={pagination.pageCurrent}
              />
              {pagination.size !== 0 && (
                <Pagination
                  pagination={pagination}
                  onChangePage={handleChangePage}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminCommissionTable
