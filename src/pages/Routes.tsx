import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PrivateRoute from '../components/route/PrivateRoute'
import AdminRoute from '../components/route/AdminRoute'
//core
import HomePage from './core/HomePage'
import ProductSearchPage from './core/ProductSearchPage'
import StoreSearchPage from './core/StoreSearchPage'
import UserSearchPage from './core/UserSearchPage'
import CategoryPage from './core/CategoryPage'
//admin
import AdminDashboardPage from './admin/DashboardPage'
import AdminLevelPage from './admin/LevelPage'
import AdminCommissionPage from './admin/CommissionPage'
import AdminUserPage from './admin/UserPage'
import AdminStorePage from './admin/StorePage'
import AdminCategoryPage from './admin/CategoryPage'
import AdminCreateCategoryPage from './admin/CreateCategoryPage'
import AdminEditCategoryPage from './admin/EditCategoryPage'
import AdminVariantPage from './admin/VariantPage'
import AdminCreateVariantPage from './admin/CreateVariantPage'
import AdminEditVariantPage from './admin/EditVariantPage'
import AdminVariantValuesPage from './admin/VariantValuePage'
import AdminBrandPage from './admin/BrandPage'
import AdminCreateBrandPage from './admin/CreateBrandPage'
import AdminEditBrandPage from './admin/EditBrandPage'
import AdminProductPage from './admin/ProductPage'
import AdminOrderPage from './admin/OrderPage'
import AdminOrderDetailPage from './admin/OrderDetailPage'
import AdminTransactionPage from './admin/TransactionPage'
import AdminReportPage from './admin/ReportPage'
import AdminReviewPage from './admin/ReviewPage'
//account
import AccountProfilePage from './account/ProfilePage'
import AccountAddressesPage from './account/AddressesPage'
import AccountOrderPage from './account/OrderPage'
import AccountFollowingPage from './account/FollowingPage'
import AccountWalletPage from './account/WalletPage'
import AccountStoreManagerPage from './account/StoreManagerPage'
import AccountCreateStorePage from './account/CreateStorePage'
import AccountVerifyEmailPage from './account/VerifyEmailPage'
import AccountChangePasswordPage from './account/ChangePasswordPage'
import AccountCartPage from './account/CartPage'
import AccountOrderDetailPage from './account/OrderDetailPage'
//seller
import SellerProfilePage from './seller/ProfilePage'
import SellerDashboardPage from './seller/DashboardPage'
import SellerProductsPage from './seller/ProductsPage'
import SellerOrderPage from './seller/OrderPage'
import SellerReturnPage from './seller/ReturnPage'
import SellerOrderDetailPage from './seller/OrderDetailPage'
import SellerStaffPage from './seller/StaffPage'
import SellerWalletPage from './seller/WalletPage'
import ReviewPage from './seller/ReviewPage'
import SellerCreateProductPage from './seller/CreateProductPage'
import SellerEditProductPage from './seller/EditProductPage'
//user
import UserHomePage from './user/UserHomePage'
import UserAboutPage from './user/UserAboutPage'
//store
import StoreHomePage from './store/HomePage'
import StoreAboutPage from './store/AboutPage'
import StoreCollectionPage from './store/CollectionPage'
import StoreReviewAndRatingPage from './store/ReviewAndRatingPage'
//product
import ProductDetailPage from './product/DetailPage'
import PageNotFound from '../components/ui/PageNotFound'
import ScrollToTops from '../hooks/ScrollToTops'
import Policy from './core/Policy'

const Routers = () => {
  return (
    <BrowserRouter>
      <ScrollToTops />
      <Routes>
        {/* core */}
        <Route path='/' element={<HomePage />} />
        <Route path='/products/search' element={<ProductSearchPage />} />
        <Route path='/stores/search' element={<StoreSearchPage />} />
        <Route path='/users/search' element={<UserSearchPage />} />
        <Route path='/category/:categoryId' element={<CategoryPage />} />
        <Route path='/legal/privacy' element={<Policy />} />

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
          path='/admin/level'
          element={
            <AdminRoute>
              <AdminLevelPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/commission'
          element={
            <AdminRoute>
              <AdminCommissionPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/report/:type?'
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
          path='/admin/store'
          element={
            <AdminRoute>
              <AdminStorePage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/review'
          element={
            <AdminRoute>
              <AdminReviewPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/category'
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
          path='/admin/variant'
          element={
            <AdminRoute>
              <AdminVariantPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/variant/create'
          element={
            <AdminRoute>
              <AdminCreateVariantPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/variant/edit/:variantId'
          element={
            <AdminRoute>
              <AdminEditVariantPage />
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
        {/*  */}
        <Route
          path='/admin/brand'
          element={
            <AdminRoute>
              <AdminBrandPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/brand/create'
          element={
            <AdminRoute>
              <AdminCreateBrandPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/brand/edit/:brandId'
          element={
            <AdminRoute>
              <AdminEditBrandPage />
            </AdminRoute>
          }
        />
        {/*  */}
        <Route
          path='/admin/product'
          element={
            <AdminRoute>
              <AdminProductPage />
            </AdminRoute>
          }
        />
        <Route
          path='/admin/order'
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
          path='/admin/transaction'
          element={
            <AdminRoute>
              <AdminTransactionPage />
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
          path='/account/purchase'
          element={
            <PrivateRoute>
              <AccountOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path='/account/purchase/detail/:orderId'
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
        />
        <Route
          path='/verify/email/:emailCode'
          element={<AccountVerifyEmailPage />}
        />
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
    </BrowserRouter>
  )
}

export default Routers
