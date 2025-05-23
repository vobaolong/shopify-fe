import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { updateProfile } from '../../../apis/user'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { notification } from 'antd'

interface Profile {
  firstName: string
  lastName: string
  email: string
  phone: string
  id_card: string
  isValidFirstName: boolean
  isValidLastName: boolean
  isValidEmail: boolean
  isValidPhone: boolean
  isValidIdCard: boolean
}

interface UserEditProfileFormProps {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  id_card?: string
  googleId?: boolean
}

const UserEditProfileForm = ({
  firstName = '',
  lastName = '',
  email = '',
  phone = '',
  id_card = '',
  googleId = false
}: UserEditProfileFormProps) => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    firstName: firstName,
    lastName: lastName,
    email: email || '',
    phone: phone || '',
    id_card: id_card || '',
    isValidFirstName: true,
    isValidLastName: true,
    isValidEmail: true,
    isValidPhone: true,
    isValidIdCard: true
  })
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()

  const updateProfileMutation = useMutation({
    mutationFn: (user: any) => updateProfile(_id, user),
    onSuccess: (res) => {
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        updateDispatch('account', data.user)
        toast.success(t('toastSuccess.userDetail.updateProfile'))
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  useEffect(() => {
    setProfile({
      firstName: firstName,
      lastName: lastName,
      email: email || '',
      phone: phone || '',
      id_card: id_card || '',
      isValidFirstName: true,
      isValidLastName: true,
      isValidEmail: true,
      isValidPhone: true,
      isValidIdCard: true
    })
  }, [firstName, lastName, email, phone, id_card])

  const handleChange = (
    name: keyof Profile,
    isValidName: keyof Profile,
    value: string
  ) => {
    setProfile({
      ...profile,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof Profile, flag: boolean) => {
    switch (isValidName) {
      case 'isValidEmail': {
        setProfile({
          ...profile,
          [isValidName]: flag || (!email && profile.email === '')
        })
        return
      }
      case 'isValidPhone': {
        setProfile({
          ...profile,
          [isValidName]: flag || (!phone && profile.phone === '')
        })
        return
      }
      case 'isValidIdCard': {
        setProfile({
          ...profile,
          [isValidName]: flag || (!id_card && profile.id_card === '')
        })
        return
      }

      default: {
        setProfile({
          ...profile,
          [isValidName]: flag
        })
        return
      }
    }
  }

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault()

    if (
      !profile.isValidFirstName ||
      !profile.isValidLastName ||
      !profile.isValidEmail ||
      !profile.isValidPhone ||
      !profile.isValidIdCard
    )
      return

    setIsConfirming(true)
  }

  const onSubmit = () => {
    let user: any = { firstName: profile.firstName, lastName: profile.lastName }
    if (!googleId && profile.email) user.email = profile.email
    if (profile.phone) user.phone = profile.phone
    if (profile.id_card) user.id_card = profile.id_card
    updateProfileMutation.mutate(user)
  }

  return (
    <div className='position-relative'>
      {updateProfileMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('userDetail.editProfile')}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
        />
      )}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-6'>
          <Input
            type='text'
            label={t('userDetail.firstName')}
            value={profile.firstName}
            isValid={profile.isValidFirstName}
            feedback={t('userDetail.validFirstName')}
            validator='name'
            required={true}
            onChange={(value) =>
              handleChange('firstName', 'isValidFirstName', value)
            }
            onValidate={(flag) => handleValidate('isValidFirstName', flag)}
          />
        </div>

        <div className='col-6'>
          <Input
            type='text'
            label={t('userDetail.lastName')}
            value={profile.lastName}
            isValid={profile.isValidLastName}
            feedback={t('userDetail.validLastName')}
            validator='name'
            required={true}
            onChange={(value) =>
              handleChange('lastName', 'isValidLastName', value)
            }
            onValidate={(flag) => handleValidate('isValidLastName', flag)}
          />
        </div>

        {!googleId && (
          <div className='col-12 mt-3'>
            <Input
              type='text'
              label='Email'
              value={profile.email}
              isValid={profile.isValidEmail}
              feedback={t('userDetail.emailValid')}
              validator='email'
              required={true}
              onChange={(value) => handleChange('email', 'isValidEmail', value)}
              onValidate={(flag) => handleValidate('isValidEmail', flag)}
            />
          </div>
        )}

        <div className='col-12 mt-3'>
          <Input
            type='text'
            label={t('userDetail.phone')}
            value={profile.phone}
            isValid={profile.isValidPhone}
            feedback={t('userDetail.phoneValid')}
            validator='phone'
            required={true}
            onChange={(value) => handleChange('phone', 'isValidPhone', value)}
            onValidate={(flag) => handleValidate('isValidPhone', flag)}
          />
        </div>

        <div className='col-12 mt-3'>
          <Input
            type='text'
            label='ID Card'
            value={profile.id_card}
            isValid={profile.isValidIdCard}
            feedback={t('userDetail.idCardValid')}
            validator='id_card'
            required={true}
            onChange={(value) =>
              handleChange('id_card', 'isValidIdCard', value)
            }
            onValidate={(flag) => handleValidate('isValidIdCard', flag)}
          />
        </div>

        <div className='col-12 d-grid mt-4'>
          <button
            type='submit'
            className='btn btn-primary ripple rounded-1'
            onClick={handleSubmit}
          >
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserEditProfileForm
