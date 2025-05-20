import {
  addAccount as addAccountAction,
  updateAvatar as updateAvatarAction
} from '../slices/accountSlice'

export const addAccount = (user) => {
  return addAccountAction(user)
}

export const updateAvatar = (avatar) => {
  return updateAvatarAction(avatar)
}
