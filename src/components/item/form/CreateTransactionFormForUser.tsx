import { getToken } from '../../../apis/auth'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useCreateTransactionByUser } from '../../../hooks/useTransaction'
import { Form, Input, InputNumber, Button, Alert } from 'antd'

interface CreateTransactionFormForUserProps {
  eWallet?: number | string
  onRun?: () => void
}

const CreateTransactionFormForUser = ({
  eWallet = 0,
  onRun
}: CreateTransactionFormForUserProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [updateDispatch] = useUpdateDispatch()
  const { _id: userId } = getToken()
  const user = useSelector((state: any) => state.account.user)
  const isGoogleUser = user && user.googleId

  const {
    mutate: createTransaction,
    isPending: isSubmitting,
    error: mutationError
  } = useCreateTransactionByUser()

  const validateAmount = (_: any, value: any) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.amountRequired')))
    }
    if (value <= 0) {
      return Promise.reject(new Error(t('transactionDetail.amountPositive')))
    }
    if (parseFloat(value) > parseFloat(eWallet.toString())) {
      return Promise.reject(new Error(t('transactionDetail.amountExceed')))
    }
    return Promise.resolve()
  }

  // Kiểm tra mật khẩu
  const validatePassword = (_: any, value: any) => {
    if (!isGoogleUser && !value) {
      return Promise.reject(new Error(t('transactionDetail.currentPwRequired')))
    }
    return Promise.resolve()
  }

  // Xử lý submit trực tiếp
  const handleSubmit = () => {
    onConfirm()
  }

  // Xử lý khi xác nhận rút tiền
  const onConfirm = () => {
    const values = form.getFieldsValue()
    const transactionData = {
      isUp: 'false',
      amount: values.amount,
      currentPassword: values.currentPassword || ''
    }

    createTransaction(
      {
        userId,
        transaction: transactionData
      },
      {
        onSuccess: (data: any) => {
          form.resetFields()
          updateDispatch('account', data.user)
          toast.success(t('toastSuccess.withDraw'))
          if (onRun) onRun()
        },
        onError: (error: any) => {
          toast.error(error.message || 'Server error')
        }
      }
    )
  }

  return (
    <div>
      {/* Form rút tiền */}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        initialValues={{ amount: 100000 }}
      >
        {/* Hiển thị lỗi nếu có */}
        {mutationError && (
          <Form.Item>
            <Alert
              message={mutationError.message || 'Error'}
              type='error'
              showIcon
              className='mb-4'
            />
          </Form.Item>
        )}

        {/* Trường nhập số tiền */}
        <Form.Item
          name='amount'
          label={t('transactionDetail.amount')}
          rules={[{ validator: validateAmount }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : ''
            }
            parser={(displayValue) =>
              displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
            }
            min={1}
            max={parseFloat(eWallet.toString())}
          />
        </Form.Item>

        {/* Trường nhập mật khẩu */}
        {!isGoogleUser && (
          <Form.Item
            name='currentPassword'
            label={t('transactionDetail.currentPw')}
            rules={[{ validator: validatePassword }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        {/* Nút submit */}
        <Form.Item>
          <Button type='primary' htmlType='submit' loading={isSubmitting} block>
            {t('button.submit')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateTransactionFormForUser
