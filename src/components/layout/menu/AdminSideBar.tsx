import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AdminSideBar = () => {
  const { t } = useTranslation()
  const path = useLocation().pathname.split('/')[2]

  return (
    <div
      className='sticky-sidebar d-flex flex-column flex-shrink-0 p-2 box-shadow bg-body rounded-1 res-account-sidebar
      '
    >
      <ul className='nav nav-pills flex-column mb-auto justify-content-around gap-1'>
        <li className='nav-item'>
          <Link
            to={`/admin/dashboard`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'dashboard' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'dashboard' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-chart-line`}
            ></i>
            <span className='ms-3 res-hide-lg'>
              {t('admin.adDashboard.dashboard')}
            </span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/users`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'users' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'users' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-user-group`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.users')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/stores`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'stores' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'stores' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-store`}
            ></i>

            <span className='ms-3 res-hide-lg'>{t('admin.stores')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to='/admin/orders'
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'orders' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'orders' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-receipt`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.orders')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to='/admin/transactions'
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'transactions' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'transactions' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-money-bill-transfer`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.transactions')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/categories`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'categories' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'categories' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-list`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.categories')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/variants`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'variants' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'variants' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-palette`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.variants')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/products`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'products' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'products' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-box`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.products')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/levels`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'levels' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'levels' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-shield-alt`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.levels')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/commissions`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'commissions' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'commissions' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-percent`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.commissions')}</span>
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            to={`/admin/reports`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'reports' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'reports' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-triangle-exclamation`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.reports')}</span>
          </Link>
        </li>
        {/*  */}
        <li className='nav-item'>
          <Link
            to={`/admin/reviews`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'reviews' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'reviews' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-comment`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.reviews')}</span>
          </Link>
        </li>
        {/*  */}
        <li className='nav-item'>
          <Link
            to={`/admin/brands`}
            className={`nav-link cus-sidebar-item cus-sidebar-item--db ripple link-dark ${
              path === 'brands' ? 'active' : ''
            }`}
          >
            <i
              className={`${
                path === 'brands' ? 'fa-solid' : 'fa-light'
              } w-10 text-center fa-font-awesome`}
            ></i>
            <span className='ms-3 res-hide-lg'>{t('admin.brands')}</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default AdminSideBar
