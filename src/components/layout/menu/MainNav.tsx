import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Modal, Drawer, Divider } from 'antd'
import {
  ExclamationCircleOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { Header } from 'antd/es/layout/layout'
import { getToken, signout } from '../../../apis/auth.api'
import Logo from './Logo'
import SearchBar from './SearchBar'
import Language from '../../ui/Language'
import CurrencyToggle from '../../ui/CurrencyToggle'
import CartPopover from '../../ui/CartPopover'
import AccountInit from '../../init/AccountInit'
import UserSmallCard from '../../card/UserSmallCard'
import StoreSmallCard from '../../card/StoreSmallCard'
import { useTranslation } from 'react-i18next'
import { selectAccountUser } from '../../../store/slices/accountSlice'
import { selectSellerStore } from '../../../store/slices/sellerSlice'
import { Role } from '../../../enums/OrderStatus.enum'
import NotificationButton from './NotificationButton'

const { confirm } = Modal

interface MainNavProps {
  navFor?: string
}

const MainNav = ({ navFor = Role.USER }: MainNavProps) => {
  const { t } = useTranslation()
  const user = useSelector(selectAccountUser)
  console.log(user)
  const store = useSelector(selectSellerStore)
  const cartCount = user?.cartCount || 0
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { refreshToken } = getToken()
  const navigate = useNavigate()

  const handleSignout = () => {
    confirm({
      title: t('dialog.logOut'),
      icon: <ExclamationCircleOutlined />,
      content: t('dialog.logOutConfirm'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      okType: 'danger',
      onOk() {
        signout(refreshToken, () => {
          navigate(0)
        })
      }
    })
    setDrawerOpen(false)
  }
  return (
    <>
      <Header className='flex items-center justify-center !bg-blue-500 sticky top-0 shadow text-white z-50 w-full p-0'>
        <div className='flex items-center max-w-7xl justify-between w-full'>
          <Link to='/'>
            <Logo />
          </Link>
          {navFor === Role.USER && (
            <div className='flex-1 max-w-xl mx-3 hidden md:block'>
              <SearchBar />
            </div>
          )}
          <div className='hidden md:flex items-center gap-2'>
            {!getToken() ? (
              <>
                <Language />
                <CurrencyToggle />
                <Button type='default' onClick={() => navigate('/signin')}>
                  {t('button.signIn')}
                </Button>
                <Button type='primary' onClick={() => navigate('/signup')}>
                  {t('button.signUp')}
                </Button>
              </>
            ) : (
              <>
                {navFor === Role.USER ? (
                  <>
                    {' '}
                    <Language />
                    <CurrencyToggle />
                    <NotificationButton navFor={navFor} />
                    <CartPopover
                      userId={user?._id || ''}
                      cartCount={cartCount}
                      className='text-white hover:bg-white hover:text-blue-600'
                    />
                    <AccountInit className='text-white' />
                  </>
                ) : (
                  <AccountInit className='text-white' />
                )}
              </>
            )}
          </div>
          <Button
            type='text'
            icon={<MenuOutlined />}
            className='!hidden text-white hover:bg-white hover:text-blue-600'
            onClick={() => setDrawerOpen(true)}
          />
        </div>
      </Header>
      <Drawer
        placement='right'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className='sm:hidden'
        width={200}
      >
        <div className='space-y-4'>
          {getToken() ? (
            <>
              <UserSmallCard user={user as any} link='/account/profile' />
              {navFor === Role.SELLER && (
                <StoreSmallCard
                  store={store as any}
                  link={`/seller/${store._id}`}
                />
              )}
              <div className='space-y-2 flex flex-col items-start justify-start'>
                {navFor === Role.USER && (
                  <>
                    <Link
                      to='/'
                      className='block'
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Button
                        type='text'
                        icon={<HomeOutlined />}
                        className='!w-full text-left'
                      >
                        {t('home')}
                      </Button>
                    </Link>

                    <Link
                      to='/cart'
                      className='block'
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Button
                        type='text'
                        icon={<ShoppingCartOutlined />}
                        className='!w-full text-left'
                      >
                        {t('cart')} ({cartCount > 0 ? cartCount : '0'})
                      </Button>
                    </Link>
                  </>
                )}
              </div>
              <Divider />
              <div className='space-y-3'>
                <div className='flex gap-2 justify-between items-center'>
                  <Language />
                  <CurrencyToggle className='!text-gray-900' />
                </div>
                <Divider />
                <Button
                  type='default'
                  danger
                  icon={<LogoutOutlined />}
                  className='w-full text-left'
                  onClick={handleSignout}
                >
                  {t('button.logout')}
                </Button>
              </div>
            </>
          ) : (
            <div className='space-y-4'>
              <div className='flex flex-col gap-2'>
                <Language />
                <CurrencyToggle />
              </div>
              <Link
                to='/signin'
                className='block'
                onClick={() => setDrawerOpen(false)}
              >
                <Button type='default' className='w-full'>
                  {t('button.signIn')}
                </Button>
              </Link>
              <Link
                to='/signup'
                className='block'
                onClick={() => setDrawerOpen(false)}
              >
                <Button type='primary' className='w-full'>
                  {t('button.signUp')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Drawer>
    </>
  )
}

export default MainNav
