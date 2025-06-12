import { useState } from 'react'
import { Form, Input, Button, Alert, Spin, Slider, InputNumber } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import {
  createTransactionByUser,
  createTransactionByStore
} from '../../../apis/transaction.api'
import { useTranslation } from 'react-i18next'
import { useAntdApp } from '../../../hooks/useAntdApp'
import useInvalidate from '../../../hooks/useInvalidate'
import { formatPrice } from '../../../helper/formatPrice'
import { useSelector } from 'react-redux'
import { TransactionType } from '../../../enums/OrderStatus.enum'

interface CreateTransactionFormProps {
  eWallet: number | string
  onRun?: () => void
  type?: 'deposit' | 'withdraw'
  storeId?: string
}

const CreateTransactionForm = ({
  eWallet = 0,
  onRun,
  type = 'withdraw',
  storeId
}: CreateTransactionFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [updateDispatch] = useUpdateDispatch()
  const invalidate = useInvalidate()
  const queryClient = useQueryClient()
  const { _id: userId } = getToken()
  const { notification } = useAntdApp()
  const [sliderValue, setSliderValue] = useState(0)

  const user = useSelector((state: any) => state.account.user)
  const isGoogleUser = user && user.googleId
  const isStoreTransaction = !!storeId
  const isDeposit = type === 'deposit'
  const eWalletNumber = Number(eWallet) || 0

  const validateAmount = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(
        new Error(
          t('transactionDetail.amountRequired') ||
            t('transactionDetail.amountValid')
        )
      )
    }
    if (value <= 0) {
      return Promise.reject(
        new Error(
          t('transactionDetail.amountPositive') ||
            t('transactionDetail.amountValid')
        )
      )
    }
    if (!isDeposit && value > eWalletNumber) {
      return Promise.reject(
        new Error(
          t('transactionDetail.amountExceed') ||
            t('transactionDetail.amountValid')
        )
      )
    }
    return Promise.resolve()
  }

  const validatePassword = (_: any, value: string) => {
    if (isGoogleUser && !isStoreTransaction) {
      return Promise.resolve()
    }

    if (!value) {
      return Promise.reject(
        new Error(
          t('transactionDetail.currentPwRequired') ||
            t('transactionDetail.currentPwValid')
        )
      )
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
        currentPassword: values.currentPassword || ''
      }

      if (isStoreTransaction) {
        return createTransactionByStore(userId, transaction, storeId)
      } else {
        return createTransactionByUser(userId, transaction)
      }
    },
    onSuccess: (res: any) => {
      if (res.error) {
        const errorMessage = res.error
        notification.error({ message: errorMessage })
      } else if (res.success) {
        form.resetFields()
        setSliderValue(0)

        if (isStoreTransaction && res.store) {
          updateDispatch('seller', res.store)
        } else if (res.user) {
          updateDispatch('account', res.user)
        }

        const successMessage = isDeposit
          ? t('toastSuccess.deposit')
          : t('toastSuccess.withdraw') || t('toastSuccess.withDraw')
        notification.success({ message: successMessage })

        invalidate({ queryKey: ['transactions'] })
        if (isStoreTransaction) {
          invalidate({ queryKey: ['store', storeId] })
        } else {
          queryClient.invalidateQueries({ queryKey: ['user', userId] })
        }
        if (onRun) onRun()
      } else {
        const errorMessage = 'Unexpected response format'
        notification.error({ message: errorMessage })
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || 'Server Error'
      notification.error({ message: errorMessage })
    }
  })

  const handleSliderChange = (percent: number) => {
    setSliderValue(percent)
    const amount = Math.round((percent / 100) * eWalletNumber)
    form.setFieldsValue({ amount })
  }

  const handleAmountChange = (e: any) => {
    const value = Number(e.target.value) || Number(e)
    if (!eWalletNumber) {
      setSliderValue(0)
      return
    }
    let percent = Math.round((value / eWalletNumber) * 100)
    if (percent < 0) percent = 0
    if (percent > 100) percent = 100
    setSliderValue(isNaN(percent) ? 0 : percent)
  }

  const buttonText = t('button.submit')
  const initialAmount = 1000000

  return (
    <div className='relative'>
      <Spin spinning={createTransactionMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={(values) => createTransactionMutation.mutate(values)}
          initialValues={{ amount: initialAmount }}
          className='space-y-2'
        >
          {createTransactionMutation.error && (
            <Form.Item>
              <Alert
                message={createTransactionMutation.error.message || 'Error'}
                type='error'
                showIcon
                className='mb-4'
              />
            </Form.Item>
          )}

          <Form.Item
            name='amount'
            label={`${t('transactionDetail.amount')} (₫)`}
            rules={[{ validator: validateAmount, required: true }]}
          >
            <InputNumber
              className='!w-full'
              placeholder={t('transactionDetail.amount')}
              disabled={createTransactionMutation.isPending}
              formatter={(value) => formatPrice(value || 0)}
              onChange={handleAmountChange}
              addonAfter={<DollarOutlined />}
              min={1}
              max={type === TransactionType.DEPOSIT ? 100000000 : eWalletNumber}
            />
          </Form.Item>
          {type === TransactionType.WITHDRAW && (
            <Form.Item>
              <Slider
                className='mb-0'
                min={0}
                max={100}
                marks={{
                  0: '0%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%'
                }}
                step={1}
                value={sliderValue}
                onChange={handleSliderChange}
                disabled={createTransactionMutation.isPending || !eWalletNumber}
                tooltip={{ open: false }}
              />
            </Form.Item>
          )}
          {type === TransactionType.DEPOSIT && (
            <Form.Item>
              <Slider
                className='mb-0'
                min={0}
                max={100}
                marks={{
                  0: '0%',
                  25: '25%',
                  50: '50%',
                  75: '75%',
                  100: '100%'
                }}
                step={1}
                value={sliderValue}
                onChange={(percent) => {
                  setSliderValue(percent)
                  const amount = Math.round((percent / 100) * 100000000)
                  form.setFieldsValue({ amount })
                }}
                disabled={createTransactionMutation.isPending}
                tooltip={{ open: false }}
              />
            </Form.Item>
          )}

          {!(isGoogleUser && !isStoreTransaction) && (
            <Form.Item
              name='currentPassword'
              label={t('transactionDetail.password')}
              rules={[{ validator: validatePassword, required: true }]}
            >
              <Input.Password
                placeholder={t('transactionDetail.password')}
                disabled={createTransactionMutation.isPending}
              />
            </Form.Item>
          )}

          <Form.Item className='mb-0'>
            <Button
              className='w-full'
              type='primary'
              htmlType='submit'
              loading={createTransactionMutation.isPending}
              disabled={createTransactionMutation.isPending}
              block
            >
              {buttonText}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default CreateTransactionForm
