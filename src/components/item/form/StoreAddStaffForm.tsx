/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { getListUsers } from '../../../apis/user.api'
import { addStaff } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import UserSmallCard from '../../card/UserSmallCard'
import SearchInput from '../../ui/SearchInput'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Error'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface StoreAddStaffFormProps {
  storeId?: string
  owner?: any
  staff?: any[]
}

const StoreAddStaffForm = ({
  storeId = '',
  owner = {},
  staff = []
}: StoreAddStaffFormProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [filter, setFilter] = useState<any>({})
  const [pagination, setPagination] = useState<any>({})
  const [listUsers, setListUsers] = useState<any[]>([])
  const [listLeft, setListLeft] = useState<any[]>([])
  const [listRight, setListRight] = useState<any[]>([])
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()

  const addStaffMutation = useMutation({
    mutationFn: async (staffIds: string[]) => {
      const res = await addStaff(_id, staffIds, storeId)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        setListRight([])
        updateDispatch('seller', data.store)
        toast.success(t('toastSuccess.staff.addStaff'))
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const init = () => {
    getListUsers(filter)
      .then((res) => {
        const data = (res as AxiosResponse<any>).data || res
        if (data.error) return
        else {
          setPagination({
            size: data.size,
            pageCurrent: data.filter.pageCurrent,
            pageCount: data.filter.pageCount
          })
          if (filter.page === 1) setListUsers(data.users)
          else setListUsers([...listUsers, ...data.users])
        }
      })
      .catch(() => {
        return
      })
  }

  useEffect(() => {
    setFilter({
      search: '',
      sortBy: 'userName',
      role: 'customer',
      order: 'asc',
      limit: 3,
      page: 1
    })
  }, [storeId, owner, staff])

  useEffect(() => {
    init()
    // eslint-disable-next-line
  }, [filter])

  useEffect(() => {
    const listCurrentStaff = staff.map((s) => s._id)
    const listCurrentRight = listRight.map((r) => r._id)
    setListLeft(
      listUsers.filter(
        (u) =>
          u._id !== owner._id &&
          listCurrentStaff.indexOf(u._id) === -1 &&
          listCurrentRight.indexOf(u._id) === -1
      )
    )
  }, [listUsers])

  const handleChangeKeyword = (keyword: string) => {
    setFilter({
      ...filter,
      search: keyword,
      page: 1
    })
  }

  const handleLoadMore = () => {
    setFilter({
      ...filter,
      page: filter.page + 1
    })
  }

  const handleAddBtn = (user: any) => {
    setListRight([...listRight, user])
    setListLeft(listLeft.filter((u) => u._id !== user._id))
  }

  const handleRemoveBtn = (user: any) => {
    setListLeft([...listLeft, user])
    setListRight(listRight.filter((u) => u._id !== user._id))
  }

  const handleSubmit = () => {
    setIsConfirming(true)
  }

  const onSubmit = () => {
    const staffIds = listRight.map((r) => r._id)
    addStaffMutation.mutate(staffIds)
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {addStaffMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('staffDetail.add')}
          message={t('message.addStaff')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <div className='row'>
        <div className='col'>
          <div className='border rounded-1 p-2 cus-group bg-light d-flex flex-column justify-content-between'>
            <div className='mb-2'>
              <SearchInput onChange={handleChangeKeyword} />
            </div>
            <div className='flex-grow-1 w-100'>
              {listLeft &&
                listLeft.map((user, index) => (
                  <div
                    key={index}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <div className='mb-2'>
                      <UserSmallCard user={user} />
                    </div>
                    <div className='position-relative d-inline-block'>
                      <button
                        type='button'
                        className='btn btn-primary btn-sm ripple rounded-1 cus-tooltip'
                        onClick={() => handleAddBtn(user)}
                      >
                        <i className='fa-solid fa-user-plus'></i>
                      </button>
                      <span className='cus-tooltip-msg'>{t('button.add')}</span>
                    </div>
                  </div>
                ))}
            </div>
            <button
              type='button'
              disabled={
                pagination && pagination.pageCount > pagination.pageCurrent
                  ? false
                  : true
              }
              className='btn btn-primary ripple w-100 mt-4 rounded-1'
              onClick={handleLoadMore}
            >
              <i className='fa-solid fa-caret-down'></i> {t('button.more')}
            </button>
          </div>
        </div>
        <div className='col'>
          <div className='border rounded-1 p-2 cus-group bg-light  d-flex flex-column justify-content-between align-items-center'>
            <div className='flex-grow-1 w-100'>
              {listRight &&
                listRight.map((user, index) => (
                  <div
                    key={index}
                    className='d-flex justify-content-between align-items-center'
                  >
                    <div className='mb-2'>
                      <UserSmallCard user={user} />
                    </div>
                    <button
                      type='button'
                      className='btn btn-outline-danger btn-sm rounded-1 ripple'
                      onClick={() => handleRemoveBtn(user)}
                    >
                      <i className='fa-solid fa-xmark'></i>
                    </button>
                  </div>
                ))}
            </div>
            <button
              type='button'
              className='btn rounded-1 btn-primary ripple w-100 mt-4'
              onClick={handleSubmit}
            >
              {t('button.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreAddStaffForm
