import { useState } from 'react'
import { getToken } from '../../../apis/auth'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useCreateTransactionByUser } from '../../../hooks/useTransaction'
import {
  Form,
  Input,
  InputNumber,
  Button,
  Alert,
  Modal,
  Spin,
  Typography,
  Space
} from 'antd'

const { Text, Title } = Typography

/**
 * Component rút tiền cho người dùng
 * Được cải tiến sử dụng Ant Design và TanStack Query
 */
const CreateTransactionFormForUser = ({ eWallet = 0, onRun }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [isConfirming, setIsConfirming] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const { _id: userId } = getToken()
  const user = useSelector((state) => state.account.user)
  const isGoogleUser = user && user.googleId

  // Sử dụng hook mutation từ useMutationFactory
  const {
    mutate: createTransaction,
    isPending: isSubmitting,
    error: mutationError
  } = useCreateTransactionByUser()

  // Kiểm tra số tiền nhập vào
  const validateAmount = (_, value) => {
    if (!value) {
      return Promise.reject(new Error(t('transactionDetail.amountRequired')))
    }
    if (value <= 0) {
      return Promise.reject(new Error(t('transactionDetail.amountPositive')))
    }
    if (parseFloat(value) > parseFloat(eWallet)) {
      return Promise.reject(new Error(t('transactionDetail.amountExceed')))
    }
    return Promise.resolve()
  }

  // Kiểm tra mật khẩu
  const validatePassword = (_, value) => {
    if (!isGoogleUser && !value) {
      return Promise.reject(new Error(t('transactionDetail.currentPwRequired')))
    }
    return Promise.resolve()
  }

  // Xử lý khi nhấn nút Submit
  const handleSubmit = () => {
    setIsConfirming(true)
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
        onSuccess: (data) => {
          form.resetFields()
          updateDispatch('account', data.user)
          toast.success(t('toastSuccess.withDraw'))
          if (onRun) onRun()
          setIsConfirming(false)
        },
        onError: (error) => {
          toast.error(error.message || 'Server error')
        }
      }
    )
  }

  return (
    <div>
      {/* Modal xác nhận */}
      <Modal
        title={t('title.createTransaction')}
        open={isConfirming}
        onOk={onConfirm}
        onCancel={() => setIsConfirming(false)}
        okText={t('button.confirm')}
        cancelText={t('button.cancel')}
        confirmLoading={isSubmitting}
      >
        <p>{t('confirmDialog')}</p>
      </Modal>

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
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            min={1}
            max={parseFloat(eWallet)}
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
