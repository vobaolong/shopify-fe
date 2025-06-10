import { useState } from 'react'
import { Form, Input, Button, Alert, Spin, Slider, InputNumber } from 'antd'
import { DollarOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { createTransactionByStore } from '../../../apis/transaction.api'
import { useTranslation } from 'react-i18next'
import { useAntdApp } from '../../../hooks/useAntdApp'
import useInvalidate from '../../../hooks/useInvalidate'
import { formatPrice } from '../../../helper/formatPrice'

interface CreateStoreTransactionFormProps {
  type: 'deposit' | 'withdraw'
  eWallet: number | string
  storeId: string
  onRun?: () => void
}

const CreateStoreTransactionForm = ({
  type,
  eWallet,
  storeId,
  onRun
}: CreateStoreTransactionFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [updateDispatch] = useUpdateDispatch()
  const invalidate = useInvalidate()
  const { _id: userId } = getToken()
  const { notification } = useAntdApp()
  const [sliderValue, setSliderValue] = useState(0)

  const isDeposit = type === 'deposit'
  const buttonText = isDeposit ? t('button.submit') : t('button.submit')
  const notificationText = isDeposit
    ? t('toastSuccess.deposit')
    : t('toastSuccess.withdraw')

  const eWalletNumber = Number(eWallet) || 0

  const validateAmount = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }
    if (value <= 0) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }
    if (!isDeposit && value > eWalletNumber) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }
    return Promise.resolve()
  }

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.currentPwValid')))
    }
    if (value.length < 6) {
      return Promise.reject(new Error(t('transactionDetail.currentPwValid')))
    }
    return Promise.resolve()
  }

  const createTransactionMutation = useMutation({
    mutationFn: (values: { amount: number; currentPassword: string }) => {
      const transaction = {
        isUp: isDeposit ? 'true' : 'false',
        amount: values.amount,
        currentPassword: values.currentPassword
      }
      return createTransactionByStore(userId, transaction, storeId)
    },
    onSuccess: (res: any) => {
      if (res.error) {
        notification.error({ message: res.error })
      } else if (res.success && res.store) {
        form.resetFields()
        setSliderValue(0)
        updateDispatch('seller', res.store)
        notification.success({ message: notificationText })
        invalidate({ queryKey: ['transactions'] })
        invalidate({ queryKey: ['store', storeId] })
        if (onRun) onRun()
      } else {
        notification.error({ message: 'Unexpected response format' })
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const handleSliderChange = (percent: number) => {
    setSliderValue(percent)
    const amount = Math.round((percent / 100) * eWalletNumber)
    form.setFieldsValue({ amount })
  }

  const handleAmountChange = (e: any) => {
    const value = Number(e.target.value)
    if (!eWalletNumber) {
      setSliderValue(0)
      return
    }
    let percent = Math.round((value / eWalletNumber) * 100)
    if (percent < 0) percent = 0
    if (percent > 100) percent = 100
    setSliderValue(isNaN(percent) ? 0 : percent)
  }

  return (
    <div className='relative'>
      <Spin spinning={createTransactionMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => createTransactionMutation.mutate(values)}
          initialValues={{
            amount: isDeposit ? 10000000 : 1000000
          }}
          className='space-y-2'
        >
          <Form.Item
            name='amount'
            label={`${t('transactionDetail.amount')} (₫)`}
            rules={[{ validator: validateAmount }]}
          >
            <InputNumber
              className='!w-full'
              placeholder={t('transactionDetail.amount')}
              disabled={createTransactionMutation.isPending}
              formatter={(value) => formatPrice(value)}
              onChange={handleAmountChange}
              addonAfter={<DollarOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <Slider
              className='mb-0'
              min={0}
              max={100}
              marks={{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }}
              step={1}
              value={sliderValue}
              onChange={handleSliderChange}
              disabled={createTransactionMutation.isPending || !eWalletNumber}
              tooltip={{ open: false }}
            />
          </Form.Item>

          <Form.Item
            name='currentPassword'
            label={t('transactionDetail.currentPw')}
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password
              placeholder={t('transactionDetail.currentPw')}
              disabled={createTransactionMutation.isPending}
            />
          </Form.Item>

          <Form.Item className='mb-0'>
            <Button
              className='w-full'
              type='primary'
              htmlType='submit'
              loading={createTransactionMutation.isPending}
              disabled={createTransactionMutation.isPending}
            >
              {buttonText}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default CreateStoreTransactionForm
