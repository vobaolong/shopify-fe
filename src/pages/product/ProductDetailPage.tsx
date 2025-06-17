import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Spin,
  Alert,
  Modal,
  Breadcrumb,
  Row,
  Col,
  Card,
  Tabs,
  Button,
  Space,
  Tag,
  Divider,
  Typography,
  Rate,
  Image
} from 'antd'
import {
  EllipsisOutlined,
  HeartOutlined,
  ShareAltOutlined,
  TruckOutlined,
  CheckOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { FacebookShareButton } from 'react-share'
import { getToken } from '../../apis/auth.api'
import { getProduct } from '../../apis/product.api'
import { getWishlistCount, checkWishlist } from '../../apis/wishlist.api'
import Carousel from '../../components/image/Carousel'
import StarRating from '../../components/label/StarRating'
import MainLayout from '../../components/layout/MainLayout'
import ListReviews from '../../components/list/ListReviews'
import StoreSmallCard from '../../components/card/StoreSmallCard'
import AddToCartForm from '../../components/item/form/AddToCartForm'
import SalePercentLabel from '../../components/label/SalePercentLabel'
import ListProductsByStore from '../../components/list/ListProductsByStore'
import FollowProductButton from '../../components/button/WishlistButton'
import ListBestSellerProduct from '../../components/list/ListBestSellerProduct'
import { calcPercent } from '../../helper/calcPercent'
import StoreCardSmall from '../../components/card/StoreCardSmall'
import MetaData from '../../components/layout/meta/MetaData'
import refundImg from '../../assets/refund.svg'
import returnImg from '../../assets/return.svg'
import checkImg from '../../assets/package.svg'
import { formatDate, formatOnlyDate } from '../../helper/humanReadable'
import notFound from '../../assets/notFound.png'
import ListReport from '../../components/item/form/ListReport'
import { useSelector } from 'react-redux'
import { ProductType } from '../../@types/entity.types'
import { useCurrencyFormat } from '../../hooks/useCurrencyFormat'
import { Role } from '../../enums/OrderStatus.enum'

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { confirm } = Modal

const productReasons = [
  {
    value: 'Sản phẩm giả mạo và bản quyền',
    label: 'Sản phẩm giả mạo và bản quyền'
  },
  { value: 'Những sản phẩm bị cấm', label: 'Những sản phẩm bị cấm' },
  { value: 'Đồ đánh cắp', label: 'Đồ đánh cắp' }
]

const getCategoryPath = (category: any): any[] => {
  const path = []
  let current = category
  while (current && typeof current === 'object' && current._id) {
    path.unshift(current)
    current = current.categoryId
  }
  return path
}

const getDecimal = (val: string | { $numberDecimal: number } | undefined) =>
  typeof val === 'string' ? val : val?.$numberDecimal?.toString() || '0'

const ProductDetailPage = () => {
  const { t } = useTranslation()
  const { productId } = useParams()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const user = useSelector((state: any) => state.account.user)
  const { formatPrice } = useCurrencyFormat()
  const {
    data: product,
    isLoading,
    error
  } = useQuery<ProductType>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const res = await getProduct(productId as string)
      if (!res) {
        throw new Error('No response from server')
      }
      let data = res.data || res
      if (data._id && data.name) {
        data = { product: data, success: true }
      }
      if (data.error || data.success === false) {
        throw new Error(data.error || data.message || 'Failed to fetch product')
      }
      const productData = data.product || data
      if (!productData || !productData._id) {
        throw new Error('Product not found')
      }
      const newProduct = { ...productData }
      newProduct.isStoreBanned =
        productData.storeId &&
        typeof productData.storeId === 'object' &&
        productData.storeId.isActive === false

      const wishlistRes = await getWishlistCount(newProduct._id)
      newProduct.numberOfFollowers = wishlistRes?.data?.count || 0

      const token = getToken()
      if (token && token._id) {
        const followRes = await checkWishlist(token._id, newProduct._id)
        newProduct.isFollowing = followRes?.data?.success === true
      } else {
        newProduct.isFollowing = false
      }

      return {
        ...newProduct,
        numberOfFollowers:
          typeof newProduct.numberOfFollowers === 'number'
            ? newProduct.numberOfFollowers
            : 0,
        isFollowing:
          typeof newProduct.isFollowing === 'boolean'
            ? newProduct.isFollowing
            : false
      }
    },
    enabled: !!productId,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  })
  const salePercent = calcPercent(product?.price, product?.salePrice)
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }

  const handleReport = () => {
    confirm({
      title: t('dialog.report'),
      icon: <ExclamationCircleOutlined />,
      content: t('dialog.reportConfirm'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk() {
        setShowReportModal(true)
      }
    })
  }

  const deliveryDateMin = new Date()
  deliveryDateMin.setDate(deliveryDateMin.getDate() + 1)
  const deliveryDateMax = new Date()
  deliveryDateMax.setDate(deliveryDateMax.getDate() + 8)

  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex justify-center items-center min-h-screen'>
          <Spin size='large' />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className='pt-4 flex flex-col items-center'>
          <Image
            width={400}
            src={notFound}
            alt='product not found'
            preview={false}
          />
          <Alert
            message={
              typeof error === 'string'
                ? error
                : error?.message || 'An error occurred'
            }
            type='error'
            className='mt-4'
          />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <MetaData title={`${product?.name} | ShopBase Việt Nam`} />
        <Breadcrumb className='my-3'>
          <Breadcrumb.Item>
            <Link to='/'>{t('home')}</Link>
          </Breadcrumb.Item>
          {getCategoryPath(product?.categoryId).map((cat) =>
            typeof cat !== 'string' ? (
              <Breadcrumb.Item key={cat._id}>
                <Link to={`/category/${cat._id}`}>{cat.name}</Link>
              </Breadcrumb.Item>
            ) : null
          )}
          {product?.name && (
            <Breadcrumb.Item>
              <Text>{product.name}</Text>
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
        <Card className='mb-6'>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Carousel
                storeId={
                  typeof product?.storeId === 'string'
                    ? product.storeId
                    : product?.storeId?._id || ''
                }
                isEditStore={false}
                listImages={
                  Array.isArray(product?.listImages)
                    ? (product.listImages as string[])
                    : []
                }
                alt={product?.name || 'Product image'}
                style={{
                  paddingBottom: 'calc(2/3*100%)'
                }}
              />{' '}
            </Col>

            <Col xs={24} md={12}>
              <div className='!space-y-4'>
                <div className='flex justify-between items-start'>
                  <StoreSmallCard store={product?.storeId as any} />
                  {getToken() && getToken().role === 'user' && (
                    <Button
                      type='text'
                      icon={<EllipsisOutlined />}
                      onClick={handleReport}
                    />
                  )}
                </div>
                {(product as any)?.isStoreBanned && (
                  <Alert
                    message={t('toastError.storeBanned')}
                    type='error'
                    showIcon
                    className='mb-4'
                  />
                )}
                <Title level={4}>{product?.name}</Title>
                <div className='flex items-center gap-3'>
                  <div className='flex items-center gap-2'>
                    <Text>{product?.rating}</Text>
                    <Rate
                      disabled
                      value={product?.rating || 0}
                      className='!text-[13px] [&_.ant-rate-star]:!mr-0.5'
                    />
                  </div>
                  <Divider type='vertical' className='!m-0 !p-0' />
                  <Text className='text-gray-500'>
                    <span>{t('productDetail.sold')} </span>
                    {product?.sold}
                  </Text>
                </div>
                {product?.brandId &&
                  typeof product.brandId !== 'string' &&
                  product.brandId.name && (
                    <Text>
                      <strong>Thương hiệu:</strong> {product.brandId.name}
                    </Text>
                  )}
                <Card className='!bg-gray-50 !border-none my-2'>
                  <div className='flex items-center gap-4 flex-wrap'>
                    <Title level={3} className='!text-blue-600 m-0'>
                      {formatPrice(Number(getDecimal(product?.salePrice)))}
                    </Title>
                    {salePercent > 0 && (
                      <Text delete className='text-gray-500 text-lg'>
                        {formatPrice(Number(getDecimal(product?.price)))}
                      </Text>
                    )}
                    <SalePercentLabel salePercent={salePercent} />
                  </div>
                </Card>
                <div className='space-y-2'>
                  {product?.storeId &&
                    typeof product.storeId !== 'string' &&
                    product.storeId.isOpen === false && (
                      <Alert
                        message={t('storeDetail.messageClose')}
                        type='error'
                      />
                    )}
                  {(product?.quantity || 0) <= 0 ? (
                    <Alert message={t('productDetail.soldOut')} type='error' />
                  ) : (
                    <Text className='text-gray-600'>
                      {product?.quantity} sản phẩm có sẵn
                    </Text>
                  )}
                </div>
                {product?.storeId &&
                  typeof product.storeId !== 'string' &&
                  product.storeId.isOpen &&
                  product.quantity > 0 &&
                  !(product as any)?.isStoreBanned &&
                  getToken()?.role === Role.USER && (
                    <AddToCartForm product={product as any} />
                  )}
                <Card
                  title={`${t('productDetail.offers')} (3)`}
                  className='!mt-4'
                >
                  <Space direction='vertical' className='w-full'>
                    <div className='flex items-center gap-3'>
                      <Image
                        src={refundImg}
                        width={25}
                        height={25}
                        preview={false}
                        alt='refund'
                      />
                      <Text>{t('services.refund')}</Text>
                    </div>
                    <Divider className='!my-2' />
                    <div className='flex items-center gap-3'>
                      <Image
                        src={returnImg}
                        width={25}
                        height={25}
                        preview={false}
                        alt='return'
                      />
                      <Text>{t('services.return')}</Text>
                    </div>
                    <Divider className='!my-2' />
                    <div className='flex items-center gap-3'>
                      <Image
                        src={checkImg}
                        width={25}
                        height={25}
                        preview={false}
                        alt='check'
                      />
                      <Text>{t('services.checkPackage')}</Text>
                    </div>
                  </Space>
                </Card>
                <Card className='border-gray-200'>
                  <div className='flex items-center gap-3'>
                    <TruckOutlined className='text-blue-600 text-lg' />
                    <div>
                      <Text strong className='block'>
                        {t('productDetail.estimatedDelivery')}
                      </Text>
                      <Text className='text-gray-600'>
                        {formatOnlyDate(deliveryDateMin)} -{' '}
                        {formatDate(deliveryDateMax)}
                      </Text>
                    </div>
                  </div>{' '}
                </Card>
                <Divider />
                <div className='flex items-center gap-4'>
                  {getToken() && getToken().role === 'user' && (
                    <>
                      <FacebookShareButton url={window.location.href || ''}>
                        <Button
                          type='text'
                          icon={<ShareAltOutlined />}
                          className='text-blue-600'
                        >
                          Chia sẻ
                        </Button>
                      </FacebookShareButton>
                      <FollowProductButton
                        productId={product?._id}
                        isWishlist={(product as any)?.isFollowing}
                        onRun={() => {}}
                      />
                    </>
                  )}
                  {((product as any)?.numberOfFollowers || 0) > 0 && (
                    <Text className='text-gray-500'>
                      {(product as any)?.numberOfFollowers} đã thích
                    </Text>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Card>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <Card>
              <Tabs defaultActiveKey='description'>
                <TabPane tab={t('productDetail.description')} key='description'>
                  <div className='relative'>
                    <div
                      className={`transition-all duration-300 ${
                        isExpanded ? '' : 'max-h-96 overflow-hidden'
                      }`}
                    >
                      <Paragraph
                        style={{ whiteSpace: 'pre-line' }}
                        className='text-justify'
                      >
                        {product?.description}
                      </Paragraph>
                    </div>

                    {!isExpanded && (
                      <div className='absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2'>
                        <Button
                          type='link'
                          onClick={handleToggle}
                          className='text-blue-600'
                        >
                          {t('showMore')}
                        </Button>
                      </div>
                    )}

                    {isExpanded && (
                      <div className='text-center mt-4'>
                        <Button
                          type='link'
                          onClick={handleToggle}
                          className='text-blue-600'
                        >
                          {t('showLess')}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabPane>

                <TabPane tab={t('productDetail.productReview')} key='reviews'>
                  <ListReviews productId={product?._id} />
                </TabPane>
              </Tabs>
            </Card>
          </Col>
          <Col xs={24} lg={6} className='hidden lg:block'>
            <Card>
              <StoreCardSmall
                store={product?.storeId as any}
                onRun={() => {}}
              />
            </Card>
          </Col>
        </Row>
        {product?.categoryId && (
          <div className='mt-6'>
            <ListBestSellerProduct
              heading={t('similarProducts')}
              categoryId={product.categoryId._id}
            />
          </div>
        )}
        {product?.storeId && typeof product.storeId !== 'string' && (
          <div className='mt-6'>
            <ListProductsByStore
              heading={t('sameShop')}
              storeId={product.storeId._id}
            />
          </div>
        )}
        <Modal
          title={t('dialog.report')}
          open={showReportModal}
          onCancel={() => setShowReportModal(false)}
          footer={null}
        >
          <ListReport
            reasons={productReasons}
            objectId={product?._id || ''}
            reportBy={user?._id}
            isProduct={true}
            isStore={false}
            isReview={false}
            showOtherReason={true}
          />
        </Modal>
      </div>
    </MainLayout>
  )
}

export default ProductDetailPage
