import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import Loading from '../../ui/Loading'
import Input from '../../ui/Input'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import Error from '../../ui/Error'
import { addAddress } from '../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { notification } from 'antd'
import {
  getDistrict,
  getProvince,
  getWard,
  GHN_TOKEN
} from '../../../apis/address.api'

async function getDistricts(provinceId: string) {
  const { data: districtList } = await axios.get(getDistrict, {
    headers: {
      Token: GHN_TOKEN
    },
    params: {
      province_id: provinceId
    }
  })
  return districtList.data
}

async function getWards(districtId: string) {
  const { data: wardList } = await axios.get(getWard, {
    headers: {
      Token: GHN_TOKEN
    },
    params: {
      district_id: districtId
    }
  })
  return wardList.data
}

interface AddressState {
  province: string
  provinceName: string
  district: string
  districtName: string
  ward: string
  wardName: string
  street: string
  isValidStreet: boolean
}

const UserAddAddressForm = () => {
  const { t } = useTranslation()
  const [isConfirming, setIsConfirming] = useState(false)
  const [address, setAddress] = useState<AddressState>({
    province: '',
    provinceName: '',
    district: '',
    districtName: '',
    ward: '',
    wardName: '',
    street: '',
    isValidStreet: true
  })
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [isLoadingDistrict, setIsLoadingDistrict] = useState(false)
  const [isLoadingWard, setIsLoadingWard] = useState(false)
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()

  // Mutation for addAddress
  const addAddressMutation = useMutation({
    mutationFn: async (addressData: any) => {
      const res = await addAddress(_id, addressData)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        updateDispatch('account', data.user)
        setAddress({
          province: '',
          provinceName: '',
          district: '',
          districtName: '',
          ward: '',
          wardName: '',
          street: '',
          isValidStreet: true
        })
        toast.success(t('toastSuccess.address.add'))
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const { data } = await axios.get(getProvince, {
          headers: {
            Token: GHN_TOKEN
          }
        })
        setProvinces(data.data)
      } catch (error) {
        console.error('Error fetching provinces:', error)
      }
    }
    fetchProvinces()
  }, [])

  const handleProvinceChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value
    const name = e.target.options[e.target.selectedIndex].text.trim()
    setAddress({
      ...address,
      province: value,
      provinceName: name,
      district: '',
      districtName: '',
      ward: '',
      wardName: ''
    })
    if (value) {
      setIsLoadingDistrict(true)
      const districts = await getDistricts(value)
      setDistricts(districts)
      setIsLoadingDistrict(false)
    } else {
      setDistricts([])
      setWards([])
    }
  }

  const handleDistrictChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value
    const name = e.target.options[e.target.selectedIndex].text.trim()
    setAddress({
      ...address,
      district: value,
      districtName: name,
      ward: '',
      wardName: ''
    })
    if (value) {
      setIsLoadingWard(true)
      const wards = await getWards(value)
      setWards(wards)
      setIsLoadingWard(false)
    } else {
      setWards([])
    }
  }

  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const name = e.target.options[e.target.selectedIndex].text.trim()
    setAddress({ ...address, ward: value, wardName: name })
  }

  const handleChange = (
    name: keyof AddressState,
    isValidName: keyof AddressState,
    value: string
  ) => {
    setAddress({
      ...address,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof AddressState, flag: boolean) => {
    setAddress({
      ...address,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { provinceName, districtName, wardName, street } = address
    if (!provinceName || !districtName || !wardName || !street) {
      notification.error({ message: t('addressFormValid.allFields') })
      return
    }
    setIsConfirming(true)
  }

  const onSubmit = () => {
    const addressString = `${address.street}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`
    const addressData = {
      provinceID: address.province,
      provinceName: address.provinceName,
      districtID: address.district,
      districtName: address.districtName,
      wardID: address.ward,
      wardName: address.wardName,
      address: addressString
    }
    addAddressMutation.mutate(addressData)
    setIsConfirming(false)
  }

  return (
    <div className='position-relative'>
      {addAddressMutation.isPending && <Loading />}
      {isConfirming && (
        <ConfirmDialog
          title={t('userDetail.addAddress')}
          onSubmit={onSubmit}
          message={t('confirmDialog')}
          onClose={() => setIsConfirming(false)}
        />
      )}
      <form className='row mb-2 text-start gap-3' onSubmit={handleSubmit}>
        <div className='col-12 d-flex justify-content-between align-items-center'>
          <label className='col-3 me-3' htmlFor='province'>
            {t('addressForm.province')}
          </label>
          <select
            className='flex-grow-1 border rounded-1 px-2 py-1 select-item'
            id='province'
            onChange={handleProvinceChange}
            value={address.province}
          >
            <option value=''>{t('addressForm.selectProvince')}</option>
            {provinces.map((province) => (
              <option key={province.ProvinceID} value={province.ProvinceID}>
                {province.ProvinceName}
              </option>
            ))}
          </select>
        </div>
        <div className='col-12 d-flex justify-content-between align-items-center'>
          <label className='col-3 me-3' htmlFor='district'>
            {t('addressForm.district')}
          </label>
          <select
            className='flex-grow-1 border rounded-1 px-2 py-1 select-item'
            id='district'
            onChange={handleDistrictChange}
            value={address.district}
            disabled={!address.province}
          >
            <option value=''>{t('addressForm.selectDistrict')}</option>
            {districts.map((district) => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
          {isLoadingDistrict && <Loading />}
        </div>
        <div className='col-12 d-flex justify-content-between align-items-center'>
          <label className='col-3 me-3' htmlFor='ward'>
            {t('addressForm.ward')}
          </label>
          <select
            className='flex-grow-1 border rounded-1 px-2 py-1 select-item'
            id='ward'
            onChange={handleWardChange}
            value={address.ward}
            disabled={!address.district}
          >
            <option value=''>{t('addressForm.selectWard')}</option>
            {wards.map((ward) => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
          {isLoadingWard && <Loading />}
        </div>
        <div className='col-12'>
          <Input
            type='text'
            label={t('addressForm.street')}
            value={address.street}
            isValid={address.isValidStreet}
            required
            feedback={t('addressFormValid.streetValid')}
            validator='address'
            onChange={(value) => handleChange('street', 'isValidStreet', value)}
            onValidate={(flag) => handleValidate('isValidStreet', flag)}
          />
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

export default UserAddAddressForm
