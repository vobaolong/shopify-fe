/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth.api'
import { deleteStaff } from '../../apis/store.api'
import useUpdateDispatch from '../../hooks/useUpdateDispatch'
import UserSmallCard from '../card/UserSmallCard'
import StoreAddStaffItem from '../item/StoreAddStaffItem'
import CancelStaffButton from '../button/CancelStaffButton'
import Pagination from '../ui/Pagination'
import SearchInput from '../ui/SearchInput'
import { Spin } from 'antd'
import ConfirmDialog from '../ui/ConfirmDialog'
import SortByButton from './sub/SortByButton'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import ShowResult from '../ui/ShowResult'
import { Alert } from 'antd'
import boxImg from '../../assets/box.svg'
import { StaffFilterState, defaultStaffFilter } from '../../@types/filter.type'

const StoreStaffTable = ({
  heading = false,
  staffIds = [],
  ownerId = {},
  storeId = ''
}) => {
  const { t } = useTranslation()
  const [deletedStaff, setDeletedStaff] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const { _id: userId } = getToken()
  const [updateDispatch] = useUpdateDispatch()
  const [listStaff, setListStaff] = useState([])
  const [pagination, setPagination] = useState({
    size: 0,
    pageCurrent: 1,
    pageCount: 1
  })
  const [alerts, setAlerts] = useState(true)
  const [filter, setFilter] = useState<StaffFilterState>(defaultStaffFilter)
  const [pendingFilter, setPendingFilter] =
    useState<StaffFilterState>(defaultStaffFilter)

  useEffect(() => {
    if (!staffIds || staffIds.length <= 0) {
      setListStaff([])
      setPagination({
        ...pagination,
        size: 0
      })
      return
    }
    const search = (filter.search || '').toLowerCase()
    const filterList = staffIds
      .filter(
        (staff: any) =>
          staff.userName.toLowerCase().includes(search) ||
          staff.name.toLowerCase().includes(search)
      )
      .sort(compareFunc(filter.sortBy || 'name', filter.order || 'asc'))

    const limit = filter.limit || 6
    const size = filterList.length
    const pageCurrent = filter.page || 1
    const pageCount = Math.ceil(size / limit)
    let skip = limit * (pageCurrent - 1)
    if (pageCurrent > pageCount) {
      skip = (pageCount - 1) * limit
    }

    const newListStaff = filterList.slice(skip, skip + limit)
    setListStaff(newListStaff)
    setPagination({
      size,
      pageCurrent,
      pageCount
    })
  }, [filter, staffIds])
  const handleChangeKeyword = (keyword: string) => {
    setPendingFilter({
      ...pendingFilter,
      search: keyword
    })
  }

  const handleSearch = () => {
    setFilter({
      ...pendingFilter,
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
      order: order as 'asc' | 'desc'
    })
  }

  const handleDeleteStaff = (staff: any) => {
    setDeletedStaff(staff)
    setIsConfirming(true)
  }
  const onDeleteSubmitStaff = () => {
    const staff = (deletedStaff as any)?._id
    setError('')
    setIsLoading(true)
    deleteStaff(userId, staff, storeId)
      .then((data) => {
        if (data.error) setError(data.error)
        else {
          updateDispatch('seller', data.store)
          toast.success(t('toastSuccess.staff.removeStaff'))
        }
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
      .catch((error) => {
        setError(`Server Error`)
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <div className='position-relative'>
      {' '}
      {alerts ? (
        <Alert
          type='info'
          message={t('alert.listStaff')}
          description={`${t('alert.thisSectionContains')} ${t('alert.theShopStaff.')}`}
          closable
          onClose={() => setAlerts(false)}
          style={{ marginBottom: 16 }}
        />
      ) : null}
      {isLoading && <Spin size='large' />}
      {isConfirming && (
        <ConfirmDialog
          title={t('staffDetail.delete')}
          color='danger'
          message={t('message.removeStaff')}
          onSubmit={onDeleteSubmitStaff}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {heading && <h5 className='text-start'>{t('staffDetail.staffList')}</h5>}
      {error && <Alert message={error} type='error' />}
      <div className='p-3 bg-white rounded-md'>
        <div className='flex gap-3 items-center flex-wrap'>
          <SearchInput
            value={pendingFilter.search || ''}
            onChange={handleChangeKeyword}
            onSearch={handleSearch}
          />
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

        {!isLoading && pagination.size === 0 ? (
          <div className='my-4 text-center'>
            <img className='mb-3' src={boxImg} alt='boxImg' width={'80px'} />
            <h5>{t('staffDetail.noStaff')}</h5>
          </div>
        ) : (
          <div className='table-scroll my-2'>
            <table className='store-staff-table table align-middle align-items-center table-hover table-sm text-start'>
              <thead>
                <tr>
                  <th scope='col' className='text-center'>
                    #
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('staffDetail.name')}
                      sortBy='name'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title='ID Card'
                      sortBy='id_card'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title='Email'
                      sortBy='email'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>
                  <th scope='col'>
                    <SortByButton
                      currentOrder={filter.order}
                      currentSortBy={filter.sortBy}
                      title={t('userDetail.phone')}
                      sortBy='phone'
                      onSet={(order, sortBy) => handleSetSortBy(order, sortBy)}
                    />
                  </th>{' '}
                  {(ownerId as any) && userId === (ownerId as any)?._id && (
                    <th scope='col'>
                      <span style={{ fontWeight: '400', fontSize: '.875rem' }}>
                        {t('action')}
                      </span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {listStaff?.map((staff: any, index: number) => (
                  <tr key={index}>
                    <th scope='row' className='text-center'>
                      {index +
                        1 +
                        ((filter.page || 1) - 1) * (filter.limit || 6)}
                    </th>
                    <td style={{ maxWidth: '300px' }}>
                      <UserSmallCard user={staff} />
                    </td>
                    <td>{staff.id_card || '-'}</td>
                    <td>{staff.email || '-'}</td>
                    <td>{staff.phone || '-'}</td>
                    {(ownerId as any) && userId === (ownerId as any)?._id && (
                      <td>
                        <div className='position-relative d-inline-block'>
                          <button
                            type='button'
                            className='btn btn-sm btn-outline-danger rounded-1 ripple cus-tooltip'
                            onClick={() => handleDeleteStaff(staff)}
                          >
                            <i className='fa-solid fa-user-xmark' />
                          </button>
                          <span className='cus-tooltip-msg'>
                            {t('button.delete')}
                          </span>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className='d-flex justify-content-between align-items-center px-4'>
          {' '}
          {pagination.size !== 0 && (
            <ShowResult
              limit={filter.limit || 6}
              size={pagination.size}
              pageCurrent={pagination.pageCurrent}
            />
          )}
          {pagination.size !== 0 && (
            <Pagination
              pagination={pagination}
              onChangePage={handleChangePage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreStaffTable

const compareFunc = (sortBy: string, order: string) => {
  return (a: any, b: any) => {
    let valueA =
      sortBy !== 'name' ? a[sortBy] : (a.userName + a.name).toLowerCase()
    let valueB =
      sortBy !== 'name' ? b[sortBy] : (b.userName + b.name).toLowerCase()

    if (typeof valueA === 'undefined') valueA = ''
    if (typeof valueB === 'undefined') valueB = ''

    if (order === 'asc') {
      if (valueA < valueB) return -1
      else if (valueA > valueB) return 1
      else return 0
    } else {
      if (valueA < valueB) return 1
      else if (valueA > valueB) return -1
      else return 0
    }
  }
}
