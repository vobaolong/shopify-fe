import { useState } from 'react'
import { getToken } from '../../../apis/auth'
import { updatePassword } from '../../../apis/user'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { notification } from 'antd'

interface Account {
  currentPassword: string
  newPassword: string
  isValidCurrentPassword: boolean
  isValidNewPassword: boolean
}

const UserEditPasswordForm = () => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)

  const [account, setAccount] = useState<Account>({
    currentPassword: '',
    newPassword: '',
    isValidCurrentPassword: true,
    isValidNewPassword: true
  })

  const { _id } = getToken()

  const updatePasswordMutation = useMutation({
    mutationFn: (user: { currentPassword: string; newPassword: string }) =>
      updatePassword(_id, user),
    onSuccess: (res) => {
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        setAccount({
          currentPassword: '',
          newPassword: '',
          isValidCurrentPassword: true,
          isValidNewPassword: true
        })
        toast.success(t('toastSuccess.userDetail.updatePassword'))
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  const handleChange = (
    name: keyof Account,
    isValidName: keyof Account,
    value: string
  ) => {
    setAccount({
      ...account,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof Account, flag: boolean) => {
    setAccount({
      ...account,
      [isValidName]: flag
    })
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    if (!account.currentPassword || !account.newPassword) {
      setAccount({
        ...account,
        isValidCurrentPassword: regexTest('password', account.currentPassword),
        isValidNewPassword: regexTest('password', account.newPassword)
      })
      return
    }

    if (!account.isValidCurrentPassword || !account.isValidNewPassword) return

    setIsConfirming(true)
  }

  const onSubmit = () => {
    const user = {
      currentPassword: account.currentPassword,
      newPassword: account.newPassword
    }
    updatePasswordMutation.mutate(user)
  }

  return (
    <div className='position-relative'>
      {updatePasswordMutation.isPending && <Loading />}

      {isConfirming && (
        <ConfirmDialog
          title={t('userDetail.changePassword')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='password'
            label={t('userDetail.currentPw')}
            value={account.currentPassword}
            isValid={account.isValidCurrentPassword}
            feedback={t('userDetail.pwValid')}
            validator='password'
            onChange={(value) =>
              handleChange('currentPassword', 'isValidCurrentPassword', value)
            }
            onValidate={(flag) =>
              handleValidate('isValidCurrentPassword', flag)
            }
          />
        </div>

        <div className='col-12'>
          <Input
            type='password'
            label={t('userDetail.newPw')}
            value={account.newPassword}
            isValid={account.isValidNewPassword}
            feedback={t('passwordFeedback')}
            onChange={(value) =>
              handleChange('newPassword', 'isValidNewPassword', value)
            }
            onValidate={(flag) => handleValidate('isValidNewPassword', flag)}
          />
        </div>

        <div className='col-12 d-grid mt-4'>
          <button
            type='submit'
            className='btn btn-primary ripple rounded-1'
            onClick={handleSubmit}
            disabled={updatePasswordMutation.isPending}
          >
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserEditPasswordForm
