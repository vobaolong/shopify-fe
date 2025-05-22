/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth'
import { createOrder } from '../../../apis/order'
import { getStoreLevel } from '../../../apis/level'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import ConfirmDialog from '../../ui/ConfirmDialog'
import UserAddAddressItem from '../../item/UserAddAddressItem'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { regexTest } from '../../../helper/test'

import vnpayImage from '../../../assets/vnpay-seeklogo.svg'
import {
  totalShippingFee,
  totalProducts,
  totalCommission
} from '../../../helper/total'
import { formatPrice } from '../../../helper/formatPrice'
import Logo from '../../layout/menu/Logo'
import Input from '../../ui/Input'
import DropDownMenu from '../../ui/DropDownMenu'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import defaultImg from '../../../assets/default.webp'

import axios, { AxiosResponse } from 'axios'
import { getAddress } from '../../../apis/address'
import { socketId } from '../../../socket'
import { VNPay } from 'vnpay'
import { getCommissionByStore } from '../../../apis/commission'
import { formatDate } from '../../../helper/humanReadable'
import dayjs from 'dayjs'

const apiEndpointFee =
  'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee'

const apiEndpointAvailableServices =
  'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services'

const headers = {
  Token: 'df39b10b-1767-11ef-bfe9-c2d25c6518ab',
  shop_id: '5080978'
}

interface ShippingFeeProps {
  insuranceValue: number
  fromDistrictId: string
  fromWardCode: string
  toDistrictId: string
  toWardCode: string
}

const calculateShippingFee = async ({
  insuranceValue,
  fromDistrictId,
  fromWardCode,
  toDistrictId,
  toWardCode
}: ShippingFeeProps) => {
  try {
    const res = await axios.post(
      apiEndpointAvailableServices,
      {
        shop_id: 5080978,
        from_district: fromDistrictId,
        to_district: toDistrictId
      },
      { headers }
    )

    const serviceId = res.data.data?.[0].service_id ?? 53321

    const response = await axios.post(
      apiEndpointFee,
      {
        service_id: serviceId,
        insurance_value: insuranceValue,
        coupon: null,
        from_district_id: fromDistrictId,
        from_ward_code: fromWardCode,
        to_district_id: toDistrictId,
        to_ward_code: toWardCode,
        height: 15,
        length: 15,
        weight: 1000,
        width: 15
      },
      { headers }
    )
    return response.data.data.total
  } catch (error) {
    console.error('Error calculating shipping fee:', error)
    return 0
  }
}

// Định nghĩa type cho item, address, order
interface Item {
  productId: {
    name: string
    salePrice: { $numberDecimal: number }
    listImages: string[]
  }
  count: number
}

interface OrderState {
  firstName: string
  lastName: string
  phone: string
  address: string
  isValidFirstName: boolean
  isValidLastName: boolean
  isValidPhone: boolean
  cartId: string
  shippingFeeBeforeDiscount: number
  shippingFee: number
  totalPrice: number
  totalSalePrice: number
  amountFromUser1: number
  amountFromUser: number
  amountFromStore: number
  amountToStore: number
  commissionId: string
  amountToPlatform: number
}

interface AddressType {
  value: string
  label: string
}

const CheckoutForm = ({
  cartId = '',
  storeId = '',
  storeAddress = '',
  userId = '',
  items = []
}: {
  cartId?: string
  storeId?: string
  storeAddress?: string
  userId?: string
  items?: Item[]
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<OrderState | null>(null)
  const [updateDispatch] = useUpdateDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: any) => state.account.user)
  const { firstName, lastName, phone, addresses, level: userLevel } = user

  const init = async () => {
    try {
      setIsLoading(true)
      const res1 = (await getStoreLevel(storeId)) as AxiosResponse<any>
      const res2 = (await getCommissionByStore(storeId)) as AxiosResponse<any>
      const res3 = (await getAddress(
        encodeURIComponent(storeAddress)
      )) as AxiosResponse<any>
      const res4 = (await getAddress(
        encodeURIComponent(order?.address || addresses[0])
      )) as AxiosResponse<any>

      // Ép kiểu items về đúng type nếu cần
      const itemsArr = Array.isArray(items) ? items : []
      const { totalPrice, totalSalePrice, amountFromUser1 } = totalProducts(
        itemsArr as any,
        userLevel
      )
      const { amountFromStore, amountToStore } = totalCommission(
        itemsArr as any,
        res1.data.level,
        res2.data.commission
      )

      // Đảm bảo districtID, wardID là string
      const fromDistrictId = res3.data.districtID
        ? String(res3.data.districtID)
        : '3440'
      const fromWardCode = res3.data.wardID ? String(res3.data.wardID) : '90758'
      const toDistrictId = res4.data.districtID
        ? String(res4.data.districtID)
        : '3695'
      const toWardCode = res4.data.wardID ? String(res4.data.wardID) : '90758'

      const shippingFeeBeforeDiscount = await calculateShippingFee({
        insuranceValue: totalPrice,
        fromDistrictId,
        fromWardCode,
        toDistrictId,
        toWardCode
      })
      const { shippingFee } = totalShippingFee(
        shippingFeeBeforeDiscount,
        userLevel
      )
      const amountFromUser = amountFromUser1 + shippingFee

      setOrder({
        firstName: firstName || '',
        lastName: lastName || '',
        phone: order?.phone || phone || '',
        address: order?.address || addresses[0] || '',
        isValidFirstName: true,
        isValidLastName: true,
        isValidPhone: true,
        cartId: cartId || '',
        shippingFeeBeforeDiscount: shippingFeeBeforeDiscount || 0,
        shippingFee: shippingFee || 0,
        totalPrice: totalPrice || 0,
        totalSalePrice: totalSalePrice || 0,
        amountFromUser1: amountFromUser1 || 0,
        amountFromUser: amountFromUser || 0,
        amountFromStore: amountFromStore || 0,
        amountToStore: amountToStore || 0,
        commissionId: res2.data.commission._id || '',
        amountToPlatform: amountFromUser - amountToStore || 0
      })
    } catch {
      setError('Server Error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    init()
    // eslint-disable-next-line
  }, [
    cartId,
    userId,
    storeId,
    items,
    firstName,
    lastName,
    phone,
    addresses,
    userLevel,
    order?.address
  ])

  const handleChange = (
    name: keyof OrderState,
    isValidName: keyof OrderState,
    value: string | number
  ) => {
    if (!order) return
    setOrder({
      ...order,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof OrderState, flag: boolean) => {
    if (!order) return
    setOrder({
      ...order,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!order) return
    const {
      cartId,
      firstName,
      lastName,
      phone,
      address,
      shippingFee,
      commissionId,
      amountFromUser,
      amountFromStore,
      amountToStore,
      amountToPlatform
    } = order
    if (
      !cartId ||
      !commissionId ||
      !firstName ||
      !lastName ||
      !phone ||
      !shippingFee ||
      !address ||
      !amountFromUser ||
      !amountFromStore ||
      !amountToStore ||
      !amountToPlatform
    ) {
      setOrder({
        ...order,
        isValidFirstName: regexTest('name', order.firstName),
        isValidLastName: regexTest('name', order.lastName),
        isValidPhone: regexTest('phone', order.phone)
      })
      return
    }
    if (
      !order.isValidFirstName ||
      !order.isValidLastName ||
      !order.isValidPhone
    )
      return
    onSubmit()
  }

  const onSubmit = () => {
    if (!order) return
    const { _id } = getToken()
    const {
      firstName,
      lastName,
      phone,
      address,
      shippingFee,
      commissionId,
      amountFromUser,
      amountFromStore,
      amountToStore,
      amountToPlatform
    } = order
    const orderBody = {
      firstName,
      lastName,
      phone,
      address,
      shippingFee,
      commissionId,
      amountFromUser,
      amountFromStore,
      amountToStore,
      amountToPlatform,
      isPaidBefore: false
    }
    setIsLoading(true)
    createOrder(_id, cartId, orderBody)
      .then((res: { data: { error?: string; user?: any; order?: any } }) => {
        if (res.data.error) {
          setError(res.data.error)
          setTimeout(() => {
            setError('')
          }, 3000)
        } else {
          updateDispatch('account', res.data.user)
          socketId.emit('createNotificationOrder', {
            objectId: res.data.order._id,
            from: _id,
            to: storeId
          })
          navigate('/account/purchase')
          toast.success(t('toastSuccess.order.create'))
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
        setTimeout(() => {
          setError('')
        }, 3000)
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      <div className='container-fluid'>
        <form className='rounded-1 row border' onSubmit={handleSubmit}>
          <div className='col-12 bg-primary rounded-top-1 p-2 px-3'>
            <Logo navFor='user' width='130px' />
          </div>

          <div className='col-xl-7 col-md-6'>
            <div className='row my-2 p-3 border bg-body rounded-1 ms-0'>
              <span className='fw-semibold col-12 fs-12'>
                {t('orderDetail.userReceiver')}
              </span>
              <hr className='my-2' />
              <div className='col-6 d-flex justify-content-between align-items-end'>
                <div className='flex-grow-1'>
                  <Input
                    type='text'
                    label={t('userDetail.firstName')}
                    value={order?.firstName || ''}
                    isValid={order?.isValidFirstName}
                    feedback={t('userDetail.validFirstName')}
                    validator='name'
                    placeholder='Ví dụ: Nguyen Van'
                    required={true}
                    onChange={(value) =>
                      handleChange('firstName', 'isValidFirstName', value)
                    }
                    onValidate={(flag) =>
                      handleValidate('isValidFirstName', flag)
                    }
                  />
                </div>
              </div>
              <div className='col-6 d-flex justify-content-between align-items-end'>
                <div className='flex-grow-1'>
                  <Input
                    type='text'
                    label={t('userDetail.lastName')}
                    value={order?.lastName || ''}
                    isValid={order?.isValidLastName}
                    feedback={t('userDetail.validLastName')}
                    validator='name'
                    placeholder='Ví dụ: A'
                    required={true}
                    onChange={(value) =>
                      handleChange('lastName', 'isValidLastName', value)
                    }
                    onValidate={(flag) =>
                      handleValidate('isValidLastName', flag)
                    }
                  />
                </div>

                <div className='d-inline-block position-relative ms-4'>
                  <div className='d-inline-block cus-tooltip'>
                    <button
                      className='btn btn-primary ripple rounded-1'
                      type='button'
                      disabled={!firstName || !lastName}
                      onClick={() => {
                        if (!order) return
                        setOrder({
                          ...order,
                          firstName: firstName || '',
                          lastName: lastName || '',
                          isValidFirstName: true,
                          isValidLastName: true,
                          phone: order.phone || '',
                          address: order.address || '',
                          cartId: order.cartId || '',
                          shippingFeeBeforeDiscount:
                            order.shippingFeeBeforeDiscount || 0,
                          shippingFee: order.shippingFee || 0,
                          totalPrice: order.totalPrice || 0,
                          totalSalePrice: order.totalSalePrice || 0,
                          amountFromUser1: order.amountFromUser1 || 0,
                          amountFromUser: order.amountFromUser || 0,
                          amountFromStore: order.amountFromStore || 0,
                          amountToStore: order.amountToStore || 0,
                          commissionId: order.commissionId || '',
                          amountToPlatform: order.amountToPlatform || 0,
                          isValidPhone: order.isValidPhone
                        })
                      }}
                    >
                      <i className='fa-light fa-user-large'></i>
                    </button>
                  </div>
                  <small className='cus-tooltip-msg'>
                    {t('orderDetail.useRegisterLastName')}
                  </small>
                </div>
              </div>
              <div className='col-12 mt-2 d-flex justify-content-between align-items-end'>
                <div className='flex-grow-1'>
                  <Input
                    type='text'
                    label={t('userDetail.phone')}
                    value={order?.phone || ''}
                    isValid={order?.isValidPhone}
                    feedback={t('userDetail.phoneValid')}
                    validator='phone'
                    placeholder='Ví dụ: 098***3433'
                    required={true}
                    onChange={(value) =>
                      handleChange('phone', 'isValidPhone', value)
                    }
                    onValidate={(flag) => handleValidate('isValidPhone', flag)}
                  />
                </div>

                <div className='d-inline-block position-relative ms-4'>
                  <div className='d-inline-block cus-tooltip'>
                    <button
                      className='btn btn-primary ripple rounded-1'
                      type='button'
                      disabled={!phone}
                      onClick={() => {
                        if (!order) return
                        setOrder({
                          ...order,
                          phone: phone || '',
                          isValidPhone: true,
                          firstName: order.firstName || '',
                          lastName: order.lastName || '',
                          address: order.address || '',
                          cartId: order.cartId || '',
                          shippingFeeBeforeDiscount:
                            order.shippingFeeBeforeDiscount || 0,
                          shippingFee: order.shippingFee || 0,
                          totalPrice: order.totalPrice || 0,
                          totalSalePrice: order.totalSalePrice || 0,
                          amountFromUser1: order.amountFromUser1 || 0,
                          amountFromUser: order.amountFromUser || 0,
                          amountFromStore: order.amountFromStore || 0,
                          amountToStore: order.amountToStore || 0,
                          commissionId: order.commissionId || '',
                          amountToPlatform: order.amountToPlatform || 0,
                          isValidFirstName: order.isValidFirstName,
                          isValidLastName: order.isValidLastName
                        })
                      }}
                    >
                      <i className='fa-light fa-phone'></i>
                    </button>
                  </div>
                  <small className='cus-tooltip-msg'>
                    {t('orderDetail.useRegisterPhone')}
                  </small>
                </div>
              </div>

              <div className='col-12 mt-2 d-flex justify-content-between align-items-end'>
                <div className='flex-grow-1'>
                  <DropDownMenu
                    borderBtn={false}
                    required={true}
                    listItem={addresses?.map((a: string) => {
                      const newA = {
                        value: a,
                        label: a
                      }
                      return newA
                    })}
                    value={order?.address || ''}
                    setValue={(address) => {
                      if (!order) return
                      setOrder({
                        ...order,
                        address: address || '',
                        firstName: order.firstName || '',
                        lastName: order.lastName || '',
                        phone: order.phone || '',
                        cartId: order.cartId || '',
                        shippingFeeBeforeDiscount:
                          order.shippingFeeBeforeDiscount || 0,
                        shippingFee: order.shippingFee || 0,
                        totalPrice: order.totalPrice || 0,
                        totalSalePrice: order.totalSalePrice || 0,
                        amountFromUser1: order.amountFromUser1 || 0,
                        amountFromUser: order.amountFromUser || 0,
                        amountFromStore: order.amountFromStore || 0,
                        amountToStore: order.amountToStore || 0,
                        commissionId: order.commissionId || '',
                        amountToPlatform: order.amountToPlatform || 0,
                        isValidFirstName: order.isValidFirstName,
                        isValidLastName: order.isValidLastName,
                        isValidPhone: order.isValidPhone
                      })
                    }}
                    size='lg'
                    label={t('userDetail.address')}
                  />

                  {addresses?.length <= 0 && (
                    <small
                      style={{
                        marginTop: '-20px',
                        display: 'block'
                      }}
                    >
                      <Error msg='Vui lòng chọn địa chỉ nhận hàng' />
                    </small>
                  )}
                </div>
                <div className='mb-2 ms-4 position-relative'>
                  <div className='d-inline-block cus-tooltip'>
                    <UserAddAddressItem
                      count={addresses?.length}
                      detail={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* <div className='row my-2 p-3 border bg-body rounded-1 ms-0'>
              <div className='col-10'>
                <b>{t('orderDetail.deliveryUnit')}</b>
                <span>: Giao hàng nhanh</span>
              </div>
              <div className='col-2'>
                {formatPrice(order.shippingFee)}
                <sup>₫</sup>
              </div>
            </div> */}
          </div>

          <div className='col-xl-5 col-md-6'>
            <div className='my-2 p-3 border bg-body rounded-1'>
              <span
                style={{ fontSize: '1.2rem' }}
                className='fw-semibold px-2 col-12'
              >
                {t('cartDetail.yourOrder')}
              </span>
              <hr className='my-2' />
              <dl className='row px-2'>
                {items.map((item) => (
                  <>
                    <dt className='col-8 text-secondary fw-normal d-flex align-items-start gap-1 mb-1'>
                      <img
                        src={item.productId?.listImages[0] && defaultImg}
                        alt=''
                        className='rounded-2 border w-20'
                      />
                      <small className='product-name'>
                        {item.productId?.name}
                      </small>
                      <span className='text-nowrap'>x {item.count}</span>
                    </dt>
                    <dd className='col-4'>
                      <dl className='row'>
                        <dd className='col-12 text-end'>
                          <span className='fs-6'>
                            {formatPrice(
                              item.productId?.salePrice?.$numberDecimal *
                                item.count
                            )}
                            <sup>₫</sup>
                          </span>
                        </dd>
                      </dl>
                    </dd>
                  </>
                ))}

                <dt className='col-7 text-secondary fw-normal'>
                  {t('cartDetail.subTotal')}
                </dt>
                <dd className='col-5'>
                  <dl className='row'>
                    <dd className='col-12 text-end'>
                      <span className='fs-6'>
                        {formatPrice(order?.totalSalePrice ?? 0)}
                        <sup>₫</sup>
                      </span>
                    </dd>
                  </dl>
                </dd>
                {order?.totalSalePrice &&
                  order?.amountFromUser1 &&
                  order.totalSalePrice - order.amountFromUser1 > 0 && (
                    <dt className='col-7 text-secondary fw-normal'>
                      {t('cartDetail.BuynowVoucherApplied')}
                    </dt>
                  )}
                {order?.totalSalePrice &&
                  order?.amountFromUser1 &&
                  order.totalSalePrice - order.amountFromUser1 > 0 && (
                    <dd className='col-5'>
                      <dl className='row'>
                        <dd className='col-12 text-end'>
                          <span className='fs-6'>
                            -{' '}
                            {formatPrice(
                              order?.totalSalePrice - order?.amountFromUser1 &&
                                0
                            )}
                            <sup>₫</sup>
                          </span>
                        </dd>
                      </dl>
                    </dd>
                  )}
                <dt className='col-7 text-secondary fw-normal'>
                  {t('cartDetail.shippingFee')}
                </dt>
                <dd className='col-5'>
                  <dl className='row'>
                    <dd className='col-12 text-end'>
                      <span className='fs-6'>
                        {formatPrice(order?.shippingFeeBeforeDiscount ?? 0)}
                        <sup>₫</sup>
                      </span>
                    </dd>
                  </dl>
                </dd>
                {order?.shippingFeeBeforeDiscount &&
                  order?.shippingFee &&
                  order.shippingFeeBeforeDiscount - order.shippingFee > 0 && (
                    <dt className='col-7 text-secondary fw-normal'>
                      {t('cartDetail.discountShippingFee')}
                    </dt>
                  )}
                {order?.shippingFeeBeforeDiscount &&
                  order?.shippingFee &&
                  order.shippingFeeBeforeDiscount - order.shippingFee > 0 && (
                    <dd className='col-5'>
                      <dl className='row'>
                        <dd className='col-12 text-end'>
                          <span className='fs-6'>
                            -{' '}
                            {formatPrice(
                              order?.shippingFeeBeforeDiscount -
                                order?.shippingFee && 0
                            )}
                            <sup>₫</sup>
                          </span>
                        </dd>
                      </dl>
                    </dd>
                  )}

                <dt className='col-7 text-secondary fw-normal'>
                  {t('cartDetail.total')}
                </dt>
                <dd className='col-5'>
                  <dl className='row'>
                    <span className='col-12 text-primary fw-bold fs-6 text-end'>
                      {formatPrice(order?.amountFromUser ?? 0)}
                      <sup>₫</sup>
                    </span>
                  </dl>
                </dd>
              </dl>

              {error && (
                <div className='my-1'>
                  <Error msg={error} />
                </div>
              )}

              <div className='mt-2'>
                <button
                  type='submit'
                  className='btn btn-primary btn-lg ripple w-100 mb-1'
                  disabled={!order?.address || !order?.phone}
                >
                  {t('orderDetail.cod')}
                </button>

                <div style={{ position: 'relative', zIndex: '1' }}>
                  <button
                    type='button'
                    className='btn btn-default hover:bg-blue-100 border-solid border-blue-700 border-2 btn-lg ripple w-100 mb-1 p-0'
                    disabled={!order?.address || !order?.phone}
                    onClick={async () => {
                      if (!order) return
                      const {
                        cartId,
                        commissionId,
                        firstName,
                        lastName,
                        phone,
                        shippingFee,
                        address,
                        amountFromUser,
                        amountFromStore,
                        amountToStore,
                        amountToPlatform
                      } = order
                      const vnpay = new VNPay({
                        tmnCode: 'M81536UR',
                        secureSecret: 'EU2OYS5JSUY59EUS9TSMOV1U9PI4L466',
                        vnpayHost: 'https://sandbox.vnpayment.vn',
                        testMode: true
                        // hashAlgorithm: 'SHA512' // optional, chỉ truyền nếu VNPay SDK cho phép
                      })
                      const date = new Date()
                      const tnx = dayjs(date).format('HHmmss')
                      const urlString = vnpay.buildPaymentUrl({
                        vnp_Amount: order.amountFromUser || 0,
                        vnp_IpAddr: '192.168.0.1',
                        vnp_ReturnUrl: `http://localhost:3000/cart?isOrder=true&cartId=${cartId}&storeId=${storeId}`,
                        vnp_TxnRef: tnx,
                        vnp_OrderInfo: `Thanh toan cho ma GD: ${tnx}`
                      })
                      const orderBody = {
                        firstName,
                        lastName,
                        phone,
                        address,
                        commissionId,
                        shippingFee,
                        amountFromUser,
                        amountFromStore,
                        amountToStore,
                        amountToPlatform,
                        isPaidBefore: true
                      }
                      localStorage.setItem('order', JSON.stringify(orderBody))
                      window.location.href = urlString
                    }}
                  >
                    <img
                      src={vnpayImage}
                      alt='vn pay'
                      width={100}
                      height={50}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CheckoutForm
