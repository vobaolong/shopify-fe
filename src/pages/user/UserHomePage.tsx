import { useSelector } from 'react-redux'
import UserLayout from '../../components/layout/UserLayout'
import { selectUserUser } from '../../store/slices/userSlice'

const UserHomePage = () => {
  const user = useSelector(selectUserUser)
  return (
    <UserLayout user={user}>
      <div className='text-center my-5'>
        <h4 className='text-uppercase'>
          Hello
          {user && user.userName && user.name && (
            <span>
              , i'm {user.userName} {user.name}
            </span>
          )}
          !
        </h4>
        <p>...</p>
      </div>
    </UserLayout>
  )
}

export default UserHomePage
