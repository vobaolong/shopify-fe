import AdminLayout from '../../components/layout/AdminLayout'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Spin, Alert } from 'antd'
import Cover from '../../components/image/Cover'
import Avatar from '../../components/image/Avatar'
import UserProfileInfo from '../../components/info/UserProfileInfo'
import UserLevelInfo from '../../components/info/UserLevelInfo'
import UserRankInfo from '../../components/info/UserRankInfo'
import { getUserProfile } from '../../apis/user.api'
import { getUserLevel } from '../../apis/level.api'
import { getToken } from '../../apis/auth.api'
import { Role } from '../../enums/OrderStatus.enum'

const AdminProfilePage = () => {
  const { t } = useTranslation()
  const { _id } = getToken()
  const paths = [
    { name: t('breadcrumbs.home'), url: '/admin/dashboard' },
    { name: t('breadcrumbs.profile'), url: '/admin/profile' }
  ]
  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['adminProfilePage', _id],
    queryFn: async () => {
      const res = await getUserProfile(_id)
      const userData = { ...res.user }
      try {
        const levelRes = await getUserLevel(_id)
        userData.level = levelRes.data.level
      } catch {
        userData.level = {}
      }
      return userData
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })

  if (isLoading) {
    return (
      <AdminLayout user={user} paths={paths}>
        <div className='flex justify-center items-center h-64'>
          <Spin size='large' />
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout user={user} paths={paths}>
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
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout user={user} paths={paths}>
        <div className='mt-8'>
          <Alert
            message='No Data'
            description='Profile data not found'
            type='warning'
            showIcon
          />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout user={user} paths={paths}>
      <div className='mt-8 bg-white rounded-lg shadow p-6 grid gap-10 w-4/5'>
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
    </AdminLayout>
  )
}

export default AdminProfilePage
