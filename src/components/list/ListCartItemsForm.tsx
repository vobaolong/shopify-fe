/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getToken } from '../../apis/auth.api'
import {
  listItemsByCart,
  deleteFromCart,
  updateCartItem
} from '../../apis/cart.api'
import { totalProducts } from '../../helper/total'
import { formatPrice } from '../../helper/formatPrice'
import useUpdateDispatch from '../../hooks/useUpdateDispatch'
import useToggle from '../../hooks/useToggle'
import { Spin, Alert } from 'antd'
import ConfirmDialog from '../ui/ConfirmDialog'
import DropDownMenu from '../ui/DropDownMenu'
import CheckoutForm from '../item/form/CheckoutForm'
import { useTranslation } from 'react-i18next'
import MallLabel from '../label/MallLabel'
import HotSaleLabel from '../label/HotSale'
import { calcPercent } from '../../helper/calcPercent'
import { toast } from 'react-toastify'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'
import { DeleteOutlined } from '@ant-design/icons'

const ListCartItems = ({
  cartId = '',
  storeId = '',
  userId = '',
  storeAddress = '',
  onRun
}: {
  cartId?: string
  storeId?: string
  userId?: string
  storeAddress?: string
  onRun?: () => void
}) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [run, setRun] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [showCheckoutFlag, toggleShowCheckoutFlag] = useToggle(false)
  const { level } = useSelector((state: any) => state.account.user)
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()
  const [deleteItem, setDeleteItem] = useState<any>({})
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['cartItems', _id, cartId, run, level],
    queryFn: () => listItemsByCart(_id, cartId).then((res) => res.data),
    enabled: !!cartId
  })
  const items: any[] = data?.items || []
  const totals = data?.totals || {
    totalPrice: 0,
    totalSalePrice: 0,
    amountFromUser1: 0
  }

  const deleteMutation = useMutation({
    mutationFn: (itemId: string) =>
      deleteFromCart(_id, itemId).then((res) => res.data),
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        toast.success(t('toastSuccess.cart.delete'))
        updateDispatch('account', data.user)
        setRun((prev) => !prev)
        if (onRun) onRun()
      }
      setIsConfirming(false)
      setTimeout(() => notification.destroy(), 3000)
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
      setIsConfirming(false)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ value, item }: { value: number; item: any }) =>
      updateCartItem(_id, value, item._id).then((res) => res.data),
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        toast.success(t('toastSuccess.cart.update'))
        updateDispatch('account', data.user)
        setRun((prev) => !prev)
        if (onRun) onRun()
      }
      setTimeout(() => notification.destroy(), 3000)
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const handleDelete = (item: any) => {
    if (!item) return
    setDeleteItem(item)
    setIsConfirming(true)
  }

  const onSubmit = () => {
    deleteMutation.mutate(deleteItem._id)
  }

  const handleUpdate = (value: number, item: any) => {
    updateMutation.mutate({ value, item })
  }
  return (
    <div className='position-relative'>
      {isLoading && <Spin size='large' />}
      {error && (
        <Alert message={error?.message || 'Server Error'} type='error' />
      )}
      {isConfirming && (
        <ConfirmDialog
          title={t('dialog.removeProductFromCart')}
          color='danger'
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}

      {items.map((item: any, index: number) => (
        <div
          key={index}
          className={`flex py-2 items-center gap-2 item${
            index === items.length - 1 ? ' last-item' : ''
          }
					${
            !item.productId?.isActive ||
            (item.productId?.isActive && !item.productId?.isSelling) ||
            (item.productId?.isActive &&
              item.productId?.isSelling &&
              item.productId?.quantity <= 0) ||
            (item.productId?.isActive &&
              item.productId?.isSelling &&
              item.productId?.quantity > 0 &&
              item.productId?.quantity < item.count)
              ? 'opacity-50'
              : ''
          }`}
        >
          <div className='flex py-1 justify-content-around align-items-start w-auto'>
            <div
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                maxWidth: '100%',
                maxHeight: '66.66667%',
                margin: '0px 5px 0 0'
              }}
            >
              <img
                loading='lazy'
                src={item.productId?.listImages[0]}
                alt={item.productId?.name}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: '0',
                  left: '0',
                  objectFit: 'contain',
                  borderRadius: '0.25rem',
                  border: '1px solid rgba(204,204,204,0.6)'
                }}
              />
            </div>
          </div>
          <div className='flex res-flex-column w-100 justify-content-between gap-1'>
            <div className='res-product-name'>
              <div className='flex gap-2'>
                <MallLabel />
                {calcPercent(item.productId?.price, item.productId?.salePrice) >
                  20 && <HotSaleLabel />}
              </div>
              <Link
                className='text-reset product-name text-decoration-none link-hover'
                to={`/product/${item.productId?._id}`}
                title={item.productId?.name}
              >
                {item.productId?.name}
              </Link>
              <div>
                {item.variantValueIds?.map((value: any, index: number) => (
                  <span className='text-muted' key={index}>
                    <small>
                      {value.variantId?.name}: {value.name}
                    </small>
                    {index < item.variantValueIds.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>

            <div className='d-inline-flex flex-lg-row flex-md-column flex-sm-row gap-2 justify-content-center items-center res-price'>
              <del className='text-secondary text-end'>
                {formatPrice(item.productId?.price?.$numberDecimal)}
                <sup>₫</sup>
              </del>
              <span
                style={{ fontWeight: '500' }}
                className='text-black text-start'
              >
                {formatPrice(item.productId?.salePrice?.$numberDecimal)}
                <sup>₫</sup>
              </span>
            </div>

            <div className='flex flex-lg-column flex-sm-row justify-content-center items-center res-quantity'>
              {item.productId?.isActive &&
                item.productId?.isSelling &&
                item.productId?.quantity > 0 && (
                  <div className='me-2'>
                    <DropDownMenu
                      listItem={
                        item.productId?.quantity &&
                        Array.from(
                          { length: Math.min(item.productId?.quantity, 5) },
                          (_, i) => {
                            return {
                              value: String(i + 1),
                              label: String(i + 1)
                            }
                          }
                        )
                      }
                      resetDefault={false}
                      value={String(item.count)}
                      setValue={(value: string) =>
                        handleUpdate(Number(value), item)
                      }
                      borderBtn={false}
                      size='sm'
                    />
                  </div>
                )}
              {item.productId?.isActive &&
                item.productId?.isSelling &&
                item.productId?.quantity <= 6 && (
                  <Alert
                    message={`${t('productDetail.only')} ${item.productId.quantity} ${t('productDetail.productLeft')}`}
                    type='warning'
                  />
                )}
              {!item.productId?.isActive && (
                <Alert message={t('toastError.productBanned')} type='error' />
              )}

              {item.productId?.isActive && !item.productId?.isSelling && (
                <Alert message={t('toastError.outOfBusiness')} type='error' />
              )}

              {item.productId?.isActive &&
                item.productId?.isSelling &&
                item.productId?.quantity <= 0 && (
                  <Alert message={t('toastError.soldOut')} type='error' />
                )}

              {item.productId?.isActive &&
                item.productId?.isSelling &&
                item.productId?.quantity > 0 &&
                item.productId?.quantity < item.count && (
                  <Alert
                    message={`${t('productDetail.only')} ${item.productId.quantity} ${t('toastError.productLeft')}`}
                    type='warning'
                  />
                )}
            </div>
            <div
              className='flex justify-content-between gap-2 text-danger my-auto items-center res-total-price'
              style={{ fontWeight: '500' }}
            >
              <span>
                {formatPrice(
                  item.productId?.salePrice.$numberDecimal * item.count
                )}
                <sup>₫</sup>
              </span>
              <div className='d-inline-block position-relative'>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-danger ripple rounded-1 cus-tooltip'
                  onClick={() => handleDelete(item)}
                >
                  <DeleteOutlined />
                </button>
                <span className='cus-tooltip-msg'>{t('button.delete')}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {items.reduce(
        (prev, item) =>
          prev &&
          item.productId?.isActive &&
          item.productId?.isSelling &&
          item.productId?.quantity > 0 &&
          item.productId?.quantity >= item.count,
        true
      ) && (
        <div className='flex flex-wrap justify-content-end items-center mt-1 pt-3 border-top'>
          {!showCheckoutFlag && (
            <div className='me-4 flex flex-column fs-9 gap-1'>
              <div className='flex justify-content-between gap-4'>
                <span className='text-secondary'>
                  {t('cartDetail.subTotal')}:{' '}
                </span>
                <span>
                  {formatPrice(totals.totalSalePrice)}
                  <sup>₫</sup>
                </span>
              </div>
              {level?.discount?.$numberDecimal > 0 && (
                <div className='flex justify-content-between gap-4'>
                  <span className='text-secondary'>
                    {t('cartDetail.ShopBaseDiscount')} (
                    {level?.discount?.$numberDecimal}%):{' '}
                  </span>
                  <span>
                    -{' '}
                    {formatPrice(
                      (totals.totalSalePrice *
                        level?.discount?.$numberDecimal) /
                        100
                    )}
                    <sup>₫</sup>
                  </span>
                </div>
              )}
              <div className='flex justify-content-between gap-4'>
                <span className='text-secondary'>
                  {t('cartDetail.totalPrice')}:{' '}
                </span>
                <span>
                  {formatPrice(totals.amountFromUser1)}
                  <sup>₫</sup>
                </span>
              </div>
            </div>
          )}

          <button
            className={`btn rounded-1 ${
              showCheckoutFlag ? 'btn-primary' : 'btn-outline-primary'
            } ripple`}
            type='button'
            onClick={toggleShowCheckoutFlag}
          >
            {t('cartDetail.proceedToCheckout')}
            <i
              className={`ms-1 fa-solid ${
                showCheckoutFlag ? 'fa-angle-up' : 'fa-angle-down'
              } fa-angle-down`}
            />
          </button>
        </div>
      )}

      {showCheckoutFlag && (
        <div className='mt-1'>
          <CheckoutForm
            cartId={cartId}
            userId={userId}
            storeId={storeId}
            storeAddress={storeAddress}
            items={items}
          />
        </div>
      )}
    </div>
  )
}

export default ListCartItems
