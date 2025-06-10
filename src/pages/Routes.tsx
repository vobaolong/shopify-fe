import React, { Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import PrivateRoute from '../components/route/PrivateRoute'
import AdminRoute from '../components/route/AdminRoute'
import ScrollToTops from '../hooks/ScrollToTops'
import PageNotFound from '../components/ui/PageNotFound'
//core
const HomePage = React.lazy(() => import('./core/HomePage'))
const ProductSearchPage = React.lazy(() => import('./core/ProductSearchPage'))
const StoreSearchPage = React.lazy(() => import('./core/StoreSearchPage'))
const UserSearchPage = React.lazy(() => import('./core/UserSearchPage'))
const CategoryPage = React.lazy(() => import('./core/CategoryPage'))
//admin
const AdminProfilePage = React.lazy(() => import('./admin/ProfilePage'))
const AdminDashboardPage = React.lazy(() => import('./admin/DashboardPage'))
const AdminLevelPage = React.lazy(() => import('./admin/LevelPage'))
const AdminCommissionPage = React.lazy(() => import('./admin/CommissionPage'))
const AdminUserPage = React.lazy(() => import('./admin/UserPage'))
const AdminStorePage = React.lazy(() => import('./admin/StorePage'))
const AdminCategoryPage = React.lazy(() => import('./admin/CategoryPage'))
const AdminCreateCategoryPage = React.lazy(
  () => import('./admin/CreateCategoryPage')
)
const AdminEditCategoryPage = React.lazy(
  () => import('./admin/EditCategoryPage')
)
const AdminVariantPage = React.lazy(() => import('./admin/VariantPage'))
const AdminCreateVariantPage = React.lazy(
  () => import('./admin/CreateVariantPage')
)
const AdminEditVariantPage = React.lazy(() => import('./admin/EditVariantPage'))
const AdminVariantValuesPage = React.lazy(
  () => import('./admin/VariantValuePage')
)
const AdminBrandPage = React.lazy(() => import('./admin/BrandPage'))
const AdminProductPage = React.lazy(() => import('./admin/ProductPage'))
const AdminOrderPage = React.lazy(() => import('./admin/OrderPage'))
const AdminOrderDetailPage = React.lazy(() => import('./admin/OrderDetailPage'))
const AdminTransactionPage = React.lazy(() => import('./admin/TransactionPage'))
const AdminReportPage = React.lazy(() => import('./admin/ReportPage'))
const AdminReviewPage = React.lazy(() => import('./admin/ReviewPage'))
//account
const AccountProfilePage = React.lazy(() => import('./account/ProfilePage'))
const AccountAddressesPage = React.lazy(() => import('./account/AddressesPage'))
const AccountOrderPage = React.lazy(() => import('./account/OrderPage'))
const AccountFollowingPage = React.lazy(() => import('./account/FollowingPage'))
const AccountWalletPage = React.lazy(() => import('./account/WalletPage'))
const AccountStoreManagerPage = React.lazy(
  () => import('./account/StoreManagerPage')
)
const AccountCreateStorePage = React.lazy(
  () => import('./account/CreateStorePage')
)
const AccountChangePasswordPage = React.lazy(
  () => import('./account/ChangePasswordPage')
)
const AccountCartPage = React.lazy(() => import('./account/CartPage'))
const AccountOrderDetailPage = React.lazy(
  () => import('./account/OrderDetailPage')
)
//seller
const SellerProfilePage = React.lazy(() => import('./seller/ProfilePage'))
const SellerDashboardPage = React.lazy(() => import('./seller/DashboardPage'))
const SellerProductsPage = React.lazy(() => import('./seller/ProductsPage'))
const SellerOrderPage = React.lazy(() => import('./seller/OrderPage'))
const SellerReturnPage = React.lazy(() => import('./seller/ReturnPage'))
const SellerOrderDetailPage = React.lazy(
  () => import('./seller/OrderDetailPage')
)
const SellerStaffPage = React.lazy(() => import('./seller/StaffPage'))
const SellerWalletPage = React.lazy(() => import('./seller/WalletPage'))
const ReviewPage = React.lazy(() => import('./seller/ReviewPage'))
const SellerCreateProductPage = React.lazy(
  () => import('./seller/CreateProductPage')
)
const SellerEditProductPage = React.lazy(
  () => import('./seller/EditProductPage')
)
//auth
const SignupPage = React.lazy(() => import('./auth/SignupPage'))
const SignInPage = React.lazy(() => import('./auth/SignInPage'))
//user
const UserHomePage = React.lazy(() => import('./user/UserHomePage'))
const UserAboutPage = React.lazy(() => import('./user/UserAboutPage'))
//store
const StoreHomePage = React.lazy(() => import('./store/HomePage'))
const StoreAboutPage = React.lazy(() => import('./store/AboutPage'))
const StoreCollectionPage = React.lazy(() => import('./store/CollectionPage'))
const StoreReviewAndRatingPage = React.lazy(
  () => import('./store/ReviewAndRatingPage')
)
//product
const ProductDetailPage = React.lazy(() => import('./product/DetailPage'))
const Policy = React.lazy(() => import('./core/Policy'))

const Routers = () => {
  return (
    <BrowserRouter>
      <ScrollToTops />
      <Suspense fallback={<Spin size='large' />}>
        <Routes>
          {/* core */}
          <Route path='/' element={<HomePage />} />
          <Route path='/products/search' element={<ProductSearchPage />} />
          <Route path='/stores/search' element={<StoreSearchPage />} />
          <Route path='/users/search' element={<UserSearchPage />} />
          <Route path='/category/:categoryId' element={<CategoryPage />} />{' '}
          <Route path='/legal/privacy' element={<Policy />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/signin' element={<SignInPage />} />
          {/* admin */}
          <Route
            path='/admin/dashboard'
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/levels'
            element={
              <AdminRoute>
                <AdminLevelPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/commissions'
            element={
              <AdminRoute>
                <AdminCommissionPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/reports/:type?'
            element={
              <AdminRoute>
                <AdminReportPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/users'
            element={
              <AdminRoute>
                <AdminUserPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/stores'
            element={
              <AdminRoute>
                <AdminStorePage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/reviews'
            element={
              <AdminRoute>
                <AdminReviewPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/categories'
            element={
              <AdminRoute>
                <AdminCategoryPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/category/create'
            element={
              <AdminRoute>
                <AdminCreateCategoryPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/category/edit/:categoryId'
            element={
              <AdminRoute>
                <AdminEditCategoryPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/variants'
            element={
              <AdminRoute>
                <AdminVariantPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/variant/values/:variantId'
            element={
              <AdminRoute>
                <AdminVariantValuesPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/brands'
            element={
              <AdminRoute>
                <AdminBrandPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/products'
            element={
              <AdminRoute>
                <AdminProductPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/orders'
            element={
              <AdminRoute>
                <AdminOrderPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/order/detail/:orderId'
            element={
              <AdminRoute>
                <AdminOrderDetailPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/transactions'
            element={
              <AdminRoute>
                <AdminTransactionPage />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/profile'
            element={
              <AdminRoute>
                <AdminProfilePage />
              </AdminRoute>
            }
          />
          {/* account */}
          <Route
            path='/account/profile'
            element={
              <PrivateRoute>
                <AccountProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/addresses'
            element={
              <PrivateRoute>
                <AccountAddressesPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/order'
            element={
              <PrivateRoute>
                <AccountOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/order/detail/:orderId'
            element={
              <PrivateRoute>
                <AccountOrderDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/following'
            element={
              <PrivateRoute>
                <AccountFollowingPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/wallet'
            element={
              <PrivateRoute>
                <AccountWalletPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/store'
            element={
              <PrivateRoute>
                <AccountStoreManagerPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/account/store/create'
            element={
              <PrivateRoute>
                <AccountCreateStorePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/cart'
            element={
              <PrivateRoute>
                <AccountCartPage />
              </PrivateRoute>
            }
          />{' '}
          <Route
            path='/change/password/:passwordCode'
            element={<AccountChangePasswordPage />}
          />
          {/* seller */}
          <Route
            path='/seller/:storeId'
            element={
              <PrivateRoute>
                <SellerDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/profile/:storeId'
            element={
              <PrivateRoute>
                <SellerProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/products/:storeId'
            element={
              <PrivateRoute>
                <SellerProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/products/addNew/:storeId'
            element={
              <PrivateRoute>
                <SellerCreateProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/products/edit/:productId/:storeId'
            element={
              <PrivateRoute>
                <SellerEditProductPage />
              </PrivateRoute>
            }
          />
          {/* <Route
            path='/seller/orders/:storeId'
            element={<PrivateRoute><SellerOrderPage /></PrivateRoute>}
          /> */}
          <Route
            path='/seller/orders/:storeId/:status?'
            element={
              <PrivateRoute>
                <SellerOrderPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/return/:storeId'
            element={
              <PrivateRoute>
                <SellerReturnPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/orders/detail/:orderId/:storeId'
            element={
              <PrivateRoute>
                <SellerOrderDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/staff/:storeId'
            element={
              <PrivateRoute>
                <SellerStaffPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/wallet/:storeId'
            element={
              <PrivateRoute>
                <SellerWalletPage />
              </PrivateRoute>
            }
          />
          <Route
            path='/seller/review/:storeId'
            element={
              <PrivateRoute>
                <ReviewPage />
              </PrivateRoute>
            }
          />
          {/* user */}
          <Route path='/user/:userId' element={<UserHomePage />} />
          <Route path='/user/about/:userId' element={<UserAboutPage />} />
          {/* store */}
          <Route path='/store/:storeId' element={<StoreHomePage />} />
          <Route
            path='/store/collection/:storeId'
            element={<StoreCollectionPage />}
          />
          <Route
            path='/store/rating/:storeId'
            element={<StoreReviewAndRatingPage />}
          />
          <Route path='/store/about/:storeId' element={<StoreAboutPage />} />
          {/* product */}
          <Route path='/product/:productId' element={<ProductDetailPage />} />
          {/* Route 404 */}
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default Routers
