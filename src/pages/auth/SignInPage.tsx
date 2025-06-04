import { Card, Typography, Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import MainLayout from '../../components/layout/MainLayout'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import MetaData from '../../components/layout/meta/MetaData'
import { signin, setToken } from '../../apis/auth.api'
import { useAntdApp } from '../../hooks/useAntdApp'
import { EMAIL_REGEX, PHONE_REGEX } from '../../constants/regex.constant'
import { Role } from '../../enums/OrderStatus.enum'

const { Title, Text } = Typography

const SignInPage = () => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const signinMutation = useMutation({
    mutationFn: async (values: any) => {
      const { identifier, password } = values
      const signinData: any = { password }
      if (EMAIL_REGEX.test(identifier)) {
        signinData.email = identifier
      } else if (PHONE_REGEX.test(identifier)) {
        signinData.phone = identifier
      } else {
        signinData.userName = identifier
      }
      return await signin(signinData)
    },
    onSuccess: (res: any) => {
      const { accessToken, refreshToken, _id, role } = res
      if (accessToken && refreshToken && _id) {
        setToken({ accessToken, refreshToken, _id, role }, () => {
          notification.success({ message: 'Đăng nhập thành công!' })
          if (role === Role.ADMIN) {
            navigate('/admin/dashboard')
          } else {
            navigate('/')
          }
        })
      } else {
        notification.error({ message: 'Dữ liệu phản hồi không đầy đủ!' })
      }
    },
    onError: (err: any) => {
      notification.error({
        message: err?.message || 'Đăng nhập thất bại!'
      })
    }
  })

  const handleFinish = (values: any) => {
    signinMutation.mutate(values)
  }

  return (
    <>
      <MetaData title={`${t('button.signIn')} | ShopBase Việt Nam`} />
      <MainLayout>
        <div className='flex items-center justify-center bg-gray-100'>
          <div className='py-4 min-w-lg'>
            <Card className='shadow-lg border-0 rounded-lg overflow-hidden'>
              <div className='text-center py-6'>
                <Title level={2} className='mb-2 font-bold'>
                  {t('button.signIn')}
                </Title>
                <Text className='text-blue-100'>
                  {t('signInForm.comeBack')}
                </Text>
              </div>
              <div className='p-8'>
                <Form form={form} layout='vertical' onFinish={handleFinish}>
                  <Form.Item
                    label={t('signInForm.identifier')}
                    name='identifier'
                    rules={[
                      {
                        required: true,
                        message:
                          'Vui lòng nhập email, số điện thoại hoặc tên đăng nhập!'
                      }
                    ]}
                  >
                    <Input
                      placeholder='Nhập email, số điện thoại hoặc tên đăng nhập'
                      size='large'
                    />
                  </Form.Item>

                  <Form.Item
                    label={t('signInForm.passwordLabel')}
                    name='password'
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu!' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                    ]}
                  >
                    <Input.Password placeholder='Nhập mật khẩu' size='large' />
                  </Form.Item>

                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={signinMutation.isPending}
                    size='large'
                    block
                    className='mt-4'
                  >
                    {t('button.signIn')}
                  </Button>
                </Form>
              </div>
              <div className='text-center py-4'>
                <Text className='text-gray-600'>
                  {t('signInForm.noAccount')}{' '}
                  <Link
                    to='/signup'
                    className='text-blue-600 hover:text-blue-800 font-semibold ml-1 no-underline'
                  >
                    {t('button.signUp')}
                  </Link>
                </Text>
              </div>
            </Card>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default SignInPage
