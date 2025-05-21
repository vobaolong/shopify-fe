import React from 'react'
import MainLayout from './MainLayout'
import UserNav from './menu/UserNav'
import Cover from '../image/Cover'
import Avatar from '../image/Avatar'
import UserLevelInfo from '../info/UserLevelInfo'

interface UserLayoutProps {
  user: any
  children: React.ReactNode
}

const UserLayout: React.FC<UserLayoutProps> = ({ user, children }) => (
  <MainLayout>
    <div className='res-mx--12-md pt-4'>
      <div className='position-relative bg-body rounded-2 p-2 box-shadow'>
        <Cover
          cover={user.cover}
          alt={(user.firstName || '') + ' ' + (user.lastName || '')}
        />
        <div className='avatar-absolute avatar-absolute--store'>
          <Avatar
            avatar={user.avatar}
            name={(user.firstName || '') + ' ' + (user.lastName || '')}
            borderName={true}
            alt={(user.firstName || '') + ' ' + (user.lastName || '')}
            onRun={() => {}}
          />
        </div>
        <div className='level-group-absolute res-hide bg-white w-50 h-100'>
          <UserLevelInfo user={user} />
        </div>
      </div>

      <div className='mt-2 d-none res-dis'>
        <UserLevelInfo user={user} />
      </div>
    </div>

    <UserNav user={user} />

    <div className='user-page-main mt-3'>{children}</div>
  </MainLayout>
)

export default UserLayout
