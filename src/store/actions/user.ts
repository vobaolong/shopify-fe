import { addUser as addUserAction } from '../slices/userSlice'

export const addUser = (user: any) => {
  return addUserAction(user)
}
