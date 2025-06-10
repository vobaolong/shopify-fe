import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateProfile } from '../../../apis/store.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import AddressForm from './AddressForm'
import { getAddress, getAddressById } from '../../../apis/address.api'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { Button, Form, Input, Spin, Alert, FormInstance } from 'antd'
import { regexTest } from '../../../constants/regex.constant'

interface StoreEditProfileFormProps {
  name?: string
  bio?: string
  address?: string
  storeId?: string
  form?: FormInstance<any>
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
  storeId = '',
  form
}: StoreEditProfileFormProps) => {
  const { notification } = useAntdApp()
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [updateDispatch] = useUpdateDispatch()
  const { t } = useTranslation()
  const [addressDetail, setAddressDetail] = useState<any>(null)
  const [profile, setProfile] = useState<ProfileState>({
    name: '',
    bio: '',
    address: '',
    isValidName: true,
    isValidBio: true,
    isValidAddress: true
  })

  // Mutation for updateProfile
  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileState) => {
      const store = {
        name: values.name,
        bio: values.bio,
        address: values.address,
        addressDetail: addressDetail
      }
      const res = await updateProfile(store, storeId)
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
    try {
      // Check if address looks like an ID (24 character hex string for MongoDB ObjectId)
      if (address.length === 24 && /^[0-9a-fA-F]{24}$/.test(address)) {
        const res = await getAddressById(address)
        setAddressDetail(res)
      } else {
        // Try to fetch by address string
        const res = await getAddress(encodeURIComponent(address))
        setAddressDetail(res)
      }
    } catch (error) {
      console.error('Error fetching address:', error)
      // If it's an address string, we can still use it directly
      if (typeof address === 'string' && address.length > 24) {
        setAddressDetail({ address })
      }
    }
  }
  useEffect(() => {
    if (address && typeof address === 'string') {
      fetchAddress(address)
    }
    form?.setFieldsValue({
      name: name,
      bio: bio,
      address: address
    })
    setProfile({
      name: name,
      bio: bio,
      address: address,
      isValidName: true,
      isValidBio: true,
      isValidAddress: true
    })
    // eslint-disable-next-line
  }, [name, bio, address, storeId, form])
  const handleSubmit = (values: any) => {
    if (!values.name?.trim() || !values.bio?.trim()) {
      setError('Please fill in all required fields')
      return
    }
    setIsConfirming(true)
  }
  const onSubmit = () => {
    const formValues = form?.getFieldsValue()
    updateProfileMutation.mutate({
      name: formValues.name,
      bio: formValues.bio,
      address: formValues.address || address,
      isValidName: true,
      isValidBio: true,
      isValidAddress: true
    })
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {updateProfileMutation.isPending && <Spin size='large' />}
      {isConfirming && (
        <ConfirmDialog
          title={t('storeDetail.editProfile')}
          onSubmit={onSubmit}
          message={t('message.edit')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      {error && (
        <Alert message={error} type='error' showIcon className='mb-4' />
      )}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleSubmit}
        className='space-y-4'
        initialValues={{
          name: name,
          bio: bio,
          address: address
        }}
      >
        <Form.Item
          label={t('storeDetail.storeName')}
          name='name'
          rules={[
            { required: true, message: t('storeDetailValid.validName') },
            { min: 2, message: t('storeDetailValid.validName') }
          ]}
        >
          <Input
            placeholder='Ví dụ: Cửa hàng giày ABC'
            onBlur={(e) => {
              const isValid = regexTest('name', e.target.value)
              if (!isValid) {
                form?.setFields([
                  {
                    name: 'name',
                    errors: [t('storeDetailValid.validName')]
                  }
                ])
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label={t('storeDetail.bio')}
          name='bio'
          rules={[
            { required: true, message: t('storeDetailValid.bioValid') },
            { max: 3000, message: t('storeDetailValid.bioValid') }
          ]}
        >
          <Input.TextArea
            rows={5}
            placeholder={t('storeDetail.bio')}
            onBlur={(e) => {
              const isValid = regexTest('bio', e.target.value)
              if (!isValid) {
                form?.setFields([
                  {
                    name: 'bio',
                    errors: [t('storeDetailValid.bioValid')]
                  }
                ])
              }
            }}
          />
        </Form.Item>

        <div className='mb-4'>
          {addressDetail !== null && (
            <AddressForm
              addressDetail={addressDetail || {}}
              onChange={(value: any) => {
                setAddressDetail({ ...addressDetail, ...value })
                form?.setFieldsValue({ address: value.street })
              }}
            />
          )}
        </div>
      </Form>
    </div>
  )
}

export default StoreEditProfileForm
