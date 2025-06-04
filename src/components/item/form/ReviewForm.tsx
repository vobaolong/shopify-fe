import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { getToken } from '../../../apis/auth.api'
import { reviewProduct } from '../../../apis/review.api'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Alert, Button, Spin, Form, Rate, Input, Modal } from 'antd'
import {
  validateAmount,
  validateRating
} from '../../../constants/regex.constant'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface ReviewFormProps {
  storeId?: string
  orderId: string
  productId: string
  productName: string
  productImage: string[]
  productVariant: string
  productVariantValue: string
  onRun: () => void
}

const ReviewForm = ({
  storeId,
  orderId,
  productId,
  productName,
  productImage = [],
  productVariant,
  productVariantValue,
  onRun
}: ReviewFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const { _id } = getToken()
  const { notification } = useAntdApp()

  const reviewMutation = useMutation({
    mutationFn: (reviewData: any) => reviewProduct(_id, reviewData),
    onSuccess: (res) => {
      if (res.data.error) {
        notification.error({ message: res.data.error })
        return
      }
      notification.success({ message: t('toastSuccess.review.add') })
      if (onRun) onRun()
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const onFinish = (values: any) => {
    if (!validateRating(values.rating)) {
      form.setFields([
        {
          name: 'rating',
          errors: [t('reviewDetail.isValid')]
        }
      ])
      return
    }

    Modal.confirm({
      title: t('productDetail.productReview'),
      icon: <ExclamationCircleOutlined />,
      content: t('confirmDialog'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk() {
        const reviewData = {
          storeId,
          orderId,
          productId,
          productName,
          productImage,
          productVariant,
          productVariantValue,
          rating: values.rating,
          content: values.content || ''
        }
        reviewMutation.mutate(reviewData)
      }
    })
  }

  return (
    <div className='position-relative'>
      <Spin spinning={reviewMutation.isPending}>
        {reviewMutation.error && (
          <Alert
            type='error'
            message={reviewMutation.error.message || 'Server Error'}
          />
        )}{' '}
        {reviewMutation.data?.data?.error && (
          <Alert type='error' message={reviewMutation.data.data.error} />
        )}
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{ rating: 4, content: '' }}
        >
          <div className='col-12'>
            <div className='d-flex mb-4'>
              <img
                className='w-15 rounded-1 me-2'
                alt={productName}
                src={
                  Array.isArray(productImage)
                    ? productImage[0] || ''
                    : productImage
                }
              />
              <div className='d-grid'>
                <span>{productName}</span>
                <small>
                  {productVariant}: {productVariantValue}
                </small>
              </div>
            </div>

            <Form.Item
              name='rating'
              label={t('reviewDetail.productQuality')}
              rules={[
                { required: true, message: t('reviewDetail.isValid') },
                {
                  validator: (_, value) =>
                    validateRating(value)
                      ? Promise.resolve()
                      : Promise.reject(new Error(t('reviewDetail.isValid')))
                }
              ]}
            >
              <Rate />
            </Form.Item>
          </div>

          <div className='col-12 mt-3'>
            <Form.Item
              name='content'
              label={t('reviewDetail.content')}
              rules={[{ max: 10000, message: t('reviewDetail.isValid') }]}
            >
              <Input.TextArea
                rows={4}
                placeholder={t('reviewDetail.content')}
              />
            </Form.Item>
          </div>

          <div className='col-sm-12 col-md-6 ms-auto d-grid mt-4'>
            <Button
              type='primary'
              htmlType='submit'
              loading={reviewMutation.isPending}
              className='w-full'
            >
              {t('button.submit')}
            </Button>
          </div>
        </Form>
      </Spin>
    </div>
  )
}

export default ReviewForm
