import { useState } from 'react'
import { Input, Button, Form, Typography } from 'antd'
import { verifyOtp } from '../../../apis/auth.api'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { useTranslation } from 'react-i18next'

interface OtpStepProps {
  email: string
  onSuccess: () => void
}

const { Text, Title } = Typography

const OtpStep = ({ email, onSuccess }: OtpStepProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await verifyOtp(email, otp)
      notification.success({ message: 'Xác thực OTP thành công!' })
      onSuccess()
    } catch (err: any) {
      notification.error({
        message: err?.message || 'OTP không đúng hoặc đã hết hạn!'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='text-center py-6 grid gap-4 mt-2'>
      <Title level={5} className='text-blue-100'>
        {t('signUpForm.enterOTP')}
      </Title>
      <Text className='text-blue-100'>{t('signUpForm.enter6DigitCode')}</Text>

      <Form onFinish={handleSubmit} layout='vertical'>
        <Form.Item
          name='otp'
          rules={[{ required: true, message: 'Vui lòng nhập mã OTP!' }]}
        >
          <Input.OTP value={otp} onChange={setOtp} length={6} />
        </Form.Item>
        <Button type='primary' htmlType='submit' loading={loading} block>
          Xác thực OTP
        </Button>
      </Form>
    </div>
  )
}

export default OtpStep
