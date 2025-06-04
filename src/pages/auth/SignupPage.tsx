import { Card, Typography, Steps } from 'antd'
import { Link } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import SignupStepper from './SignupStepper'
import { useTranslation } from 'react-i18next'
import MetaData from '../../components/layout/meta/MetaData'

const { Title, Text } = Typography

const SignupPage = () => {
  const { t } = useTranslation()

  return (
    <>
      <MetaData title={`${t('button.signUp')} | ShopBase Việt Nam`} />
      <MainLayout>
        <div className='flex items-center justify-center bg-gray-100'>
          <div className='py-4 w-[400px] max-w-full'>
            <Card className='shadow-lg border-0 rounded-lg overflow-hidden'>
              <div className='text-center py-6 grid gap-2'>
                <Title level={2} className='mb-2 font-bold'>
                  {t('button.signUp')}
                </Title>
              </div>
              <div className='p-8'>
                <SignupStepper />
              </div>{' '}
              <div className='text-center py-4'>
                <Text className='text-gray-600'>
                  {t('signInForm.haveAnAccount')}{' '}
                  <Link
                    to='/signin'
                    className='text-blue-600 hover:text-blue-800 font-semibold ml-1 no-underline'
                  >
                    {t('button.signIn')}
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

export default SignupPage
