import { useState } from 'react'
import { Input, Button, Form, Typography } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { checkEmailExists, sendOtpToEmail } from '../../../apis/auth.api'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { useTranslation } from 'react-i18next'

interface EmailStepProps {
  onSuccess: (email: string) => void
}
const { Text } = Typography
const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [email, setEmail] = useState<string>('')
  const emailMutation = useMutation({
    mutationFn: async (email: string) => {
      const exists = await checkEmailExists(email)
      if (exists) {
        throw new Error('Email đã tồn tại, vui lòng nhập email khác.')
      }
      await sendOtpToEmail(email)
      return email
    },
    onSuccess: (email) => {
      notification.success({ message: 'Đã gửi mã OTP về email.' })
      onSuccess(email)
    },
    onError: (err: any) => {
      notification.error({ message: err?.message || 'Server Error!' })
    }
  })

  const handleSubmit = () => {
    emailMutation.mutate(email)
  }

  return (
    <div className='text-center py-6 grid gap-2 mt-2'>
      <Text strong className='text-blue-100'>
        {t('signUpForm.enterEmail')}
      </Text>
      <Text className='text-blue-100'>{t('signUpForm.youWillReceive')}</Text>

      <Form onFinish={handleSubmit} layout='vertical'>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          loading={emailMutation.isPending}
          block
          disabled={
            !email || !/^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
          }
        >
          Gửi mã OTP
        </Button>
      </Form>
    </div>
  )
}

export default EmailStep
