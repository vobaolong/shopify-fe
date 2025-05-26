import {
  addAccount as addAccountAction,
  updateAvatar as updateAvatarAction
} from '../slices/accountSlice'

export const addAccount = (user: any) => {
  return addAccountAction(user)
}

export const updateAvatar = (avatar: any) => {
  return updateAvatarAction(avatar)
}
