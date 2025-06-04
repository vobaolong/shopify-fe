import { useState } from 'react'
import { Form, Input, Button, Alert, Spin } from 'antd'
import { DollarOutlined, LockOutlined } from '@ant-design/icons'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { createTransactionByStore } from '../../../apis/transaction.api'
import {
  validateAmount,
  validatePassword
} from '../../../constants/regex.constant'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'

interface TransactionFormData {
  amount: number
  currentPassword: string
}

interface CreateDepositTransactionFormProps {
  eWallet?: number | string
  storeId?: string
  onRun?: () => void
}

const CreateDepositTransactionForm = ({
  eWallet = 0,
  storeId = '',
  onRun
}: CreateDepositTransactionFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [updateDispatch] = useUpdateDispatch()

  const { _id: userId } = getToken()

  const createDepositMutation = useMutation({
    mutationFn: (values: TransactionFormData) => {
      const transaction = {
        isUp: 'true',
        amount: values.amount,
        currentPassword: values.currentPassword
      }
      return createTransactionByStore(userId, transaction, storeId)
    },
    onSuccess: (res: { data: { error?: string; store?: any } }) => {
      if (res.data.error) {
        setError(res.data.error)
        setTimeout(() => setError(''), 3000)
      } else {
        form.resetFields()
        updateDispatch('seller', res.data.store)
        toast.success(t('toastSuccess.deposit'))
        if (onRun) onRun()
      }
    },
    onError: () => {
      setError('Server Error')
      setTimeout(() => setError(''), 3000)
    }
  })
  const onFinish = (values: TransactionFormData) => {
    setError('')
    createDepositMutation.mutate(values)
  }
  const validateAmountField = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }

    if (!validateAmount(value)) {
      return Promise.reject(new Error('Số tiền từ 1,000 đến 1,000,000,000 VND'))
    }

    return Promise.resolve()
  }

  const validatePasswordField = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.currentPwValid')))
    }

    if (!validatePassword(value)) {
      return Promise.reject(
        new Error(
          'Mật khẩu 6-50 ký tự, có ít nhất 1 chữ cái và 1 số, không chứa khoảng trắng'
        )
      )
    }

    return Promise.resolve()
  }

  return (
    <div className='relative'>
      <Spin spinning={createDepositMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            amount: 10000000
          }}
          className='space-y-4'
        >
          {' '}
          <Form.Item
            name='amount'
            label={`${t('transactionDetail.amount')} (₫)`}
            rules={[{ validator: validateAmountField }]}
          >
            <Input
              type='number'
              prefix={<DollarOutlined className='text-gray-400' />}
              placeholder={t('transactionDetail.amount')}
              className='h-10'
            />
          </Form.Item>{' '}
          <Form.Item
            name='currentPassword'
            label={t('transactionDetail.currentPw')}
            rules={[{ validator: validatePasswordField }]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder={t('transactionDetail.currentPw')}
              className='h-10'
            />
          </Form.Item>
          {error && (
            <Alert message={error} type='error' showIcon className='mb-4' />
          )}
          <Form.Item className='mb-0'>
            <Button
              type='primary'
              htmlType='submit'
              loading={createDepositMutation.isPending}
              className='w-full h-10 bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600'
            >
              {t('button.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default CreateDepositTransactionForm
