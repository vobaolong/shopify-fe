import { Form, Input, Button } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { signup } from '../../../apis/auth.api'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { t } from 'i18next'
import { PHONE_REGEX } from '../../../constants/regex.constant'

interface InfoStepProps {
  email: string
}

const InfoStep = ({ email }: InfoStepProps) => {
  const { notification } = useAntdApp()
  const [form] = Form.useForm()

  const signupMutation = useMutation({
    mutationFn: (values: any) => signup({ ...values, email }),
    onSuccess: () => {
      notification.success({ message: 'Đăng ký thành công!' })
    },
    onError: (err: any) => {
      notification.error({ message: err?.message || 'Đăng ký thất bại!' })
    }
  })

  const handleFinish = (values: any) => {
    signupMutation.mutate(values)
  }

  return (
    <Form form={form} layout='vertical' onFinish={handleFinish}>
      {' '}
      <Form.Item
        label={t('userDetail.userName')}
        name='userName'
        rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={t('userDetail.name')}
        name='name'
        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
      >
        <Input />
      </Form.Item>{' '}
      <Form.Item
        label={t('userDetail.phone')}
        name='phone'
        rules={[
          { required: true, message: 'Vui lòng nhập số điện thoại!' },
          {
            pattern: PHONE_REGEX,
            message: 'Số điện thoại không hợp lệ!'
          }
        ]}
      >
        <Input placeholder='Ví dụ: 0987654321' />
      </Form.Item>
      <Form.Item
        label={t('signInForm.passwordLabel')}
        name='password'
        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label={t('confirmPw')}
        name='passwordConfirm'
        dependencies={['password']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'))
            }
          })
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Button
        type='primary'
        htmlType='submit'
        loading={signupMutation.isPending}
        block
      >
        Đăng ký
      </Button>
    </Form>
  )
}

export default InfoStep
