import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateProfile } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Input from '../../ui/Input'
import TextArea from '../../ui/TextArea'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import AddressForm from './AddressForm'
import { getAddress } from '../../../apis/address.api'
import Error from '../../ui/Error'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { notification } from 'antd'

interface StoreEditProfileFormProps {
  name?: string
  bio?: string
  address?: string
  storeId?: string
}

interface ProfileState {
  name: string
  bio: string
  address: string
  isValidName: boolean
  isValidBio: boolean
  isValidAddress: boolean
}

const StoreEditProfileForm = ({
  name = '',
  bio = '',
  address = '',
  storeId = ''
}: StoreEditProfileFormProps) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const [profile, setProfile] = useState<ProfileState>({
    name: '',
    bio: '',
    address: '',
    isValidName: true,
    isValidBio: true,
    isValidAddress: true
  })
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()
  const { t } = useTranslation()
  const [addressDetail, setAddressDetail] = useState<any>(null)

  // Mutation for updateProfile
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileState) => {
      const store = {
        name: values.name,
        bio: values.bio,
        address: values.address,
        addressDetail: addressDetail
      }
      const res = await updateProfile(_id, store, storeId)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        toast.success(t('toastSuccess.store.update'))
        updateDispatch('seller', data.store)
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const fetchAddress = async (address: string) => {
    const res = await getAddress(encodeURIComponent(address))
    setAddressDetail(res)
  }

  useEffect(() => {
    fetchAddress(address)
    setProfile({
      name: name,
      bio: bio,
      address: address,
      isValidName: true,
      isValidBio: true,
      isValidAddress: true
    })
    // eslint-disable-next-line
  }, [name, bio, address, storeId])

  const handleChange = (
    name: keyof ProfileState,
    isValidName: keyof ProfileState,
    value: string
  ) => {
    setProfile({
      ...profile,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof ProfileState, flag: boolean) => {
    setProfile({
      ...profile,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!profile.isValidName || !profile.isValidBio || !profile.isValidAddress)
      return
    setIsConfirming(true)
  }

  const onSubmit = () => {
    updateProfileMutation.mutate(profile)
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {updateProfileMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('storeDetail.editProfile')}
          onSubmit={onSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('storeDetail.storeName')}
            value={profile.name}
            isValid={profile.isValidName}
            feedback={t('storeDetailValid.validName')}
            validator='name'
            required={true}
            placeholder='Ví dụ: Cửa hàng giày ABC'
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>
        <div className='col-12 mt-3'>
          <TextArea
            label={t('storeDetail.bio')}
            value={profile.bio}
            isValid={profile.isValidBio}
            feedback={t('storeDetailValid.bioValid')}
            validator='bio'
            onChange={(value) => handleChange('bio', 'isValidBio', value)}
            onValidate={(flag) => handleValidate('isValidBio', flag)}
            row={5}
          />
        </div>
        <div className='col-12 mt-3'>
          {addressDetail !== null && (
            <AddressForm
              addressDetail={addressDetail}
              onChange={(value: any) => {
                setAddressDetail({ ...addressDetail, ...value })
                handleChange('address', 'isValidAddress', value.street)
              }}
            />
          )}
        </div>

        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.save')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default StoreEditProfileForm
