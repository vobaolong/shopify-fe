import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import SigninForm from '../../components/item/form/SigninForm'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'

const { Title, Text } = Typography

const SignInPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <MetaData title={`${t('button.signIn')} | Buynow Việt Nam`} />
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
                <SigninForm />
              </div>
              <div className='text-center py-4'>
                <Text className='text-gray-600'>
                  {t('signInForm.dontHaveAccount')}{' '}
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
