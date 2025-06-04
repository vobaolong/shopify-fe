import Paragraph from '../ui/Paragraph'
import UserRoleLabel from '../label/UserRoleLabel'
import { useTranslation } from 'react-i18next'
import { humanReadableDate } from '../../helper/humanReadable'
import React from 'react'

interface UserJoinedInfoProps {
  user: {
    role?: string
    createdAt?: string
  }
}

const UserJoinedInfo = ({ user = {} }: UserJoinedInfoProps) => {
  const { t } = useTranslation()

  return (
    <div className='container-fluid'>
      <div className='row py-2 border rounded-1 bg-body'>
        <div className='col-12'>
          <Paragraph
            label={t('role')}
            colon
            value={<UserRoleLabel role={user.role || ''} />}
          />
        </div>

        <div className='col-12'>
          <Paragraph
            label={
              <span>
                <i className='fa-solid fa-user-check me-1 text-secondary' />
                {t('joined')}
              </span>
            }
            colon
            time={user.createdAt ? humanReadableDate(user.createdAt) : ''}
          />
        </div>
      </div>
    </div>
  )
}

export default UserJoinedInfo
