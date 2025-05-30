/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getUserLevel } from '../../apis/level.api'
import { Link } from 'react-router-dom'
import UserRoleLabel from '../label/UserRoleLabel'
import LevelLabel from '../label/LevelLabel'
import { UserType } from '../../@types/entity.types'

interface UserCardProps {
  user: UserType
}

const UserCard = ({ user }: UserCardProps) => {
  const [userValue, setUserValue] = useState<UserType>(user)
  const init = async () => {
    let newUser: UserType = { ...user }
    try {
      const data = await getUserLevel(user._id)
      newUser.level = data.data.level
    } catch {}
    setUserValue(newUser)
  }

  useEffect(() => {
    init()
  }, [user])

  return (
    <div className='card shadow border-0'>
      <Link
        className='text-reset text-decoration-none'
        title={userValue.firstName + ' ' + userValue.lastName}
        to={`/user/${userValue._id}`}
      >
        <div className='card-img-top cus-card-img-top'>
          <img
            loading='lazy'
            src={userValue.avatar}
            className='cus-card-img'
            alt={userValue.firstName + ' ' + userValue.lastName}
          />
        </div>
      </Link>

      <div className='card-body border-top border-secondary'>
        <small className='card-subtitle'>
          <div className='d-flex align-items-center'>
            <span className='me-1'>
              <UserRoleLabel role={userValue.role} detail={false} />
            </span>{' '}
            <span className=''>
              {userValue.level && (
                <LevelLabel level={userValue.level} detail={false} />
              )}
            </span>
          </div>
        </small>

        <Link
          className='text-reset text-decoration-none link-hover d-block mt-2'
          title={userValue.firstName + ' ' + userValue.lastName}
          to={`/user/${userValue._id}`}
        >
          <h6
            className='card-title'
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {userValue.firstName + ' ' + userValue.lastName}
          </h6>
        </Link>
      </div>
    </div>
  )
}

export default UserCard
