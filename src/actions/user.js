import { addUser as addUserAction } from '../slices/userSlice'

export const addUser = (user) => {
  return addUserAction(user)
}
