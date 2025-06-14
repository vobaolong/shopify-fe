import { useQuery } from '@tanstack/react-query'
import { Spin, Alert } from 'antd'
import { useTranslation } from 'react-i18next'
import Cover from '../../components/image/Cover'
import Avatar from '../../components/image/Avatar'
import UserProfileInfo from '../../components/info/UserProfileInfo'
import UserLevelInfo from '../../components/info/UserLevelInfo'
import UserRankInfo from '../../components/info/UserRankInfo'
import { getUserProfile } from '../../apis/user.api'
import { getUserLevel } from '../../apis/level.api'
import { getToken } from '../../apis/auth.api'
import AccountLayout from '../../components/layout/AccountLayout'
import { Role } from '../../enums/OrderStatus.enum'

const ProfilePage = () => {
  const { t } = useTranslation()
  const token = getToken()
  const _id = token._id
  const paths = [
    { name: t('breadcrumbs.home'), url: '/' },
    { name: t('breadcrumbs.profileInfo'), url: '/account/profile' }
  ]
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['userProfilePage', _id],
    queryFn: async () => {
      const res = await getUserProfile(_id)
      const user = { ...res.user }
      try {
        const levelRes = await getUserLevel(_id)
        user.level = levelRes.data.level
      } catch {
        user.level = {}
      }
      return user
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
  if (isLoading) {
    return (
      <AccountLayout user={user} paths={paths}>
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      </AccountLayout>
    )
  }

  if (error) {
    return (
      <AccountLayout user={user} paths={paths}>
        <div className='mt-8'>
          <Alert
            message='Error'
            description={
              error instanceof Error ? error.message : 'Failed to load profile'
            }
            type='error'
            showIcon
          />
        </div>
      </AccountLayout>
    )
  }

  if (!user) {
    return (
      <AccountLayout user={user} paths={paths}>
        <div className='mt-8'>
          <Alert
            message='No Data'
            description='Profile data not found'
            type='warning'
            showIcon
          />
        </div>
      </AccountLayout>
    )
  }

  return (
    <AccountLayout user={user} paths={paths}>
      <div className='mt-8 bg-white rounded-lg shadow-lg p-6 grid gap-10'>
        <div className='relative mb-8'>
          <Cover cover={user.cover} alt={user.userName} isEditStore={false} />
          <div className='absolute left-10 -bottom-12'>
            <Avatar
              avatar={user.avatar}
              alt={user.userName}
              isEditable='user'
            />
          </div>
        </div>
        <div className='mt-20 grid grid-cols-1 md:grid-cols-2 gap-2'>
          <UserProfileInfo user={user} isEditable={true} />
          <div className='flex flex-col gap-2 p-4'>
            <UserLevelInfo user={user} />
            {user.role !== Role.ADMIN && <UserRankInfo user={user} />}
          </div>
        </div>
      </div>
    </AccountLayout>
  )
}

export default ProfilePage
