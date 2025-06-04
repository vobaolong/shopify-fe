import { useState } from 'react'
import { Form, Input, Button, Alert, Spin } from 'antd'
import { DollarOutlined, LockOutlined } from '@ant-design/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { createTransactionByStore } from '../../../apis/transaction.api'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface TransactionState {
  amount: number
  currentPassword: string
}

interface CreateWithDrawTransactionFormProps {
  eWallet: number | string
  storeId: string
  onRun: () => void
}

const CreateWithDrawTransactionForm = ({
  eWallet,
  storeId,
  onRun
}: CreateWithDrawTransactionFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [updateDispatch] = useUpdateDispatch()
  const queryClient = useQueryClient()

  const { _id: userId } = getToken()

  const createTransactionMutation = useMutation({
    mutationFn: (transaction: {
      isUp: string
      amount: number
      currentPassword: string
    }) => createTransactionByStore(userId, transaction, storeId),
    onSuccess: (res: { data: { error?: string; store?: any } }) => {
      if (res.data.error) {
        setError(res.data.error)
        setTimeout(() => setError(''), 3000)
      } else {
        form.resetFields()
        updateDispatch('seller', res.data.store)
        toast.success(t('toastSuccess.withdraw'))
        queryClient.invalidateQueries({ queryKey: ['transactions'] })
        queryClient.invalidateQueries({ queryKey: ['store', storeId] })
        if (onRun) onRun()
      }
    },
    onError: () => {
      setError('Server Error')
      setTimeout(() => setError(''), 3000)
    }
  })

  const onFinish = (values: TransactionState) => {
    setError('')

    const transaction = {
      isUp: 'false',
      amount: values.amount,
      currentPassword: values.currentPassword
    }

    createTransactionMutation.mutate(transaction)
  }

  const validateAmount = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }
    if (!validateAmount('positive', value)) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }
    if (parseFloat(value.toString()) > parseFloat(eWallet.toString())) {
      return Promise.reject(new Error(t('transactionDetail.amountValid')))
    }
    return Promise.resolve()
  }

  const validatePassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.currentPwValid')))
    }
    if (!validatePassword('password', value)) {
      return Promise.reject(new Error(t('transactionDetail.currentPwValid')))
    }
    return Promise.resolve()
  }

  return (
    <div className='relative'>
      {error && (
        <Alert message={error} type='error' showIcon className='mb-4' />
      )}
      <Spin spinning={createTransactionMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            amount: 1000000
          }}
          className='space-y-4'
        >
          <Form.Item
            name='amount'
            label={`${t('transactionDetail.amount')} (₫)`}
            rules={[{ validator: validateAmount }]}
          >
            <Input
              type='number'
              prefix={<DollarOutlined className='text-gray-400' />}
              placeholder={t('transactionDetail.amount')}
              className='h-10'
            />
          </Form.Item>

          <Form.Item
            name='currentPassword'
            label={t('transactionDetail.currentPw')}
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password
              prefix={<LockOutlined className='text-gray-400' />}
              placeholder={t('transactionDetail.currentPw')}
              className='h-10'
            />
          </Form.Item>

          <Form.Item className='mb-0'>
            <Button
              type='primary'
              htmlType='submit'
              loading={createTransactionMutation.isPending}
              className='w-full h-10 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600'
            >
              {t('button.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default CreateWithDrawTransactionForm
