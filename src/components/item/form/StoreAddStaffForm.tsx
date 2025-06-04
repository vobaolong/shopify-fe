/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { getListUsers } from '../../../apis/user.api'
import { addStaff } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import UserSmallCard from '../../card/UserSmallCard'
import SearchInput from '../../ui/SearchInput'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { Button, Spin } from 'antd'
import { UserAddOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons'

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
  const [pendingFilter, setPendingFilter] = useState<any>({})
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
    const initialFilter = {
      search: '',
      sortBy: 'userName',
      role: 'customer',
      order: 'asc',
      limit: 3,
      page: 1
    }
    setFilter(initialFilter)
    setPendingFilter(initialFilter)
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
    setPendingFilter({
      ...pendingFilter,
      search: keyword,
      page: 1
    })
  }

  const handleSearch = () => {
    setFilter({ ...pendingFilter })
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
    <Spin spinning={addStaffMutation.isPending}>
      <div className='relative'>
        {isConfirming && (
          <ConfirmDialog
            title={t('staffDetail.add')}
            message={t('message.addStaff')}
            onSubmit={onSubmit}
            onClose={() => setIsConfirming(false)}
          />
        )}
        <div className='flex flex-wrap -mx-2'>
          <div className='w-full md:w-1/2 px-2 mb-4 md:mb-0'>
            <div className='border rounded p-4 bg-gray-50 flex flex-col justify-between h-full'>
              {' '}
              <div className='mb-4'>
                <SearchInput
                  value={pendingFilter.search || ''}
                  onChange={handleChangeKeyword}
                  onSearch={handleSearch}
                />
              </div>
              <div className='flex-grow w-full mb-4'>
                {listLeft &&
                  listLeft.map((user, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center mb-3'
                    >
                      <div>
                        <UserSmallCard user={user} />
                      </div>
                      <Button
                        type='primary'
                        size='small'
                        icon={<UserAddOutlined />}
                        onClick={() => handleAddBtn(user)}
                        title={t('button.add')}
                      />
                    </div>
                  ))}
              </div>
              <Button
                type='primary'
                disabled={
                  pagination && pagination.pageCount > pagination.pageCurrent
                    ? false
                    : true
                }
                icon={<DownOutlined />}
                onClick={handleLoadMore}
                className='w-full'
              >
                {t('button.more')}
              </Button>
            </div>
          </div>
          <div className='w-full md:w-1/2 px-2'>
            <div className='border rounded p-4 bg-gray-50 flex flex-col justify-between h-full'>
              <div className='flex-grow w-full mb-4'>
                {listRight &&
                  listRight.map((user, index) => (
                    <div
                      key={index}
                      className='flex justify-between items-center mb-3'
                    >
                      <div>
                        <UserSmallCard user={user} />
                      </div>
                      <Button
                        type='primary'
                        danger
                        size='small'
                        icon={<CloseOutlined />}
                        onClick={() => handleRemoveBtn(user)}
                      />
                    </div>
                  ))}
              </div>
              <Button
                type='primary'
                onClick={handleSubmit}
                className='w-full'
                loading={addStaffMutation.isPending}
              >
                {t('button.submit')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default StoreAddStaffForm
