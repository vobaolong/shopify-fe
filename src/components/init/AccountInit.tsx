import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getToken, signout } from '../../apis/auth.api'
import { getUser } from '../../apis/user.api'
import { getUserLevel } from '../../apis/level.api'
import { getCartCount } from '../../apis/cart.api'
import { useTranslation } from 'react-i18next'
import { Alert, Avatar, Dropdown, Modal, Spin } from 'antd'
import {
  UserOutlined,
  ShopOutlined,
  ShoppingOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { addAccount } from '../../store/slices/accountSlice'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

const AccountInit = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const token = getToken()
  const _id = token ? token._id : null
  const refreshToken = token ? token.refreshToken : null
  const role = token ? token.role : null

  const {
    data: userData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userAccountInit', _id],
    queryFn: async () => {
      if (!_id) return null
      const res = await getUser(_id)
      const newUser = res.user
      if (!newUser) throw new Error('User data not found')
      try {
        const levelRes = await getUserLevel(_id)
        newUser.level = levelRes.level || {}
      } catch {
        newUser.level = {}
      }
      try {
        const cartRes = await getCartCount(_id)
        newUser.cartCount = cartRes.count || 0
      } catch {
        newUser.cartCount = 0
      }
      return newUser
    },
    enabled: !!_id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  const signoutMutation = useMutation({
    mutationFn: () =>
      signout(refreshToken, () => {
        navigate(0)
      }),
    onSuccess: () => {
      queryClient.clear()
      navigate(0)
    }
  })

  const handleSignout = () => {
    Modal.confirm({
      title: t('button.logout'),
      content: t('confirmDialog'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: () => signoutMutation.mutate()
    })
  }

  const menuItems = useMemo(
    () => [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: (
          <Link className='!no-underline p-2' to='/account/profile'>
            {t('userDetail.myAccount')}
          </Link>
        )
      },
      ...(role === 'user'
        ? [
            {
              key: 'store',
              icon: <ShopOutlined />,
              label: (
                <Link className='!no-underline p-2' to='/account/store'>
                  {t('myStore')}
                </Link>
              )
            },
            {
              key: 'order',
              icon: <ShoppingOutlined />,
              label: (
                <Link className='!no-underline p-2' to='/account/order'>
                  {t('userDetail.myPurchase')}
                </Link>
              )
            }
          ]
        : []),
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: (
          <span
            onClick={handleSignout}
            className='!no-underline p-2 text-red-600'
          >
            {t('button.logout')}
          </span>
        )
      }
    ],
    [role, t]
  )

  useEffect(() => {
    if (userData && Object.keys(userData).length > 0) {
      const userDataWithId = { ...userData, _id }
      queryClient.setQueryData(['accountUser'], userDataWithId)
      dispatch(addAccount(userDataWithId))
    }
  }, [userData, _id, queryClient, dispatch])

  if (isLoading) {
    return <Spin size='small' />
  }

  if (error) {
    return (
      <Alert message={error.message} type='error' showIcon className='mb-4' />
    )
  }

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
      placement='bottomRight'
    >
      <Avatar className='cursor-pointer' src={userData?.avatar} size={32} />
    </Dropdown>
  )
}

export default AccountInit
