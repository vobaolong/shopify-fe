/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import {
  getProvincesGHN,
  getDistrictsGHN,
  getWardsGHN
} from '../../../apis/address'
import { Input } from 'antd'

const AddressForm = ({ addressDetail, onChange }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [address, setAddress] = useState({
    province: addressDetail?.provinceID ?? '',
    provinceName: addressDetail?.provinceName ?? '',
    district: addressDetail?.districtID ?? '',
    districtName: addressDetail?.districtName ?? '',
    ward: addressDetail?.wardID ?? '',
    wardName: addressDetail?.wardName ?? '',
    street: addressDetail?.address?.split(', ')[0] ?? ''
  })
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])

  const fetchProvinces = async () => {
    try {
      setIsLoading(true)
      const provinces = await getProvincesGHN()
      setProvinces(provinces)
    } catch (error) {
      console.error('Error fetching provinces:', error)
      setError('Không thể tải danh sách tỉnh/thành')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDistricts = async (provinceId) => {
    if (!provinceId) return

    try {
      setIsLoading(true)
      const districts = await getDistrictsGHN(provinceId)
      setDistricts(districts)
    } catch (error) {
      console.error('Error fetching districts:', error)
      setError('Không thể tải danh sách quận/huyện')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchWards = async (districtId) => {
    if (!districtId) return

    try {
      setIsLoading(true)
      const wards = await getWardsGHN(districtId)
      setWards(wards)
    } catch (error) {
      console.error('Error fetching wards:', error)
      setError('Không thể tải danh sách phường/xã')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProvinces()

    if (addressDetail?.provinceID) {
      fetchDistricts(addressDetail.provinceID)
    }
    if (addressDetail?.districtID) {
      fetchWards(addressDetail.districtID)
    }
  }, [])

  const handleProvinceChange = (e) => {
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

    setWards([])

    if (value) {
      fetchDistricts(value)
    } else {
      setDistricts([])
    }
  }

  const handleDistrictChange = (e) => {
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
      fetchWards(value)
    } else {
      setWards([])
    }
  }

  const handleWardChange = (e) => {
    const value = e.target.value
    const name = e.target.options[e.target.selectedIndex].text.trim()
    setAddress({ ...address, ward: value, wardName: name })
  }

  const handleChange = (value) => {
    if (address.provinceName && address.districtName && address.wardName) {
      setAddress((prev) => ({
        ...prev,
        street: value
      }))

      const addressString = `${value}, ${address.wardName}, ${address.districtName}, ${address.provinceName}`

      onChange({ ...address, street: addressString })
    }
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}
      <div className='row mb-2 text-start gap-3'>
        <div className='col-12 d-flex flex-column justify-content-between align-items-center'>
          <label className='col-12 mb-1' htmlFor='province'>
            {t('addressForm.province')} <span className='text-danger'>*</span>
          </label>
          <select
            className='col-12 border rounded-1 px-2 py-1 select-item text-dark-emphasis'
            id='province'
            onChange={handleProvinceChange}
            value={address.province}
          >
            <option value=''>{t('addressForm.selectProvince')}</option>
            {provinces
              .slice()
              .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
              .map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
          </select>
        </div>

        <div className='col-12 d-flex flex-column justify-content-between align-items-center'>
          <label className='col-12 mb-1' htmlFor='district'>
            {t('addressForm.district')} <span className='text-danger'>*</span>
          </label>
          <select
            className='col-12 border rounded-1 px-2 py-1 select-item text-dark-emphasis'
            id='district'
            onChange={handleDistrictChange}
            value={address.district}
            disabled={!address.province}
          >
            <option value=''>{t('addressForm.selectDistrict')}</option>
            {districts
              .slice()
              .sort((a, b) => a.DistrictName.localeCompare(b.DistrictName))
              .map((district) => (
                <option key={district.DistrictID} value={district.DistrictID}>
                  {district.DistrictName}
                </option>
              ))}
          </select>
        </div>

        <div className='col-12 d-flex flex-column justify-content-between align-items-center'>
          <label className='col-12 mb-1' htmlFor='ward'>
            {t('addressForm.ward')} <span className='text-danger'>*</span>
          </label>
          <select
            className='col-12 border rounded-1 px-2 py-1 select-item text-dark-emphasis'
            id='ward'
            onChange={handleWardChange}
            value={address.ward}
            disabled={!address.district}
          >
            <option value=''>{t('addressForm.selectWard')}</option>
            {wards
              .slice()
              .sort((a, b) => a.WardName.localeCompare(b.WardName))
              .map((ward) => (
                <option key={ward.WardID} value={ward.WardID}>
                  {ward.WardName}
                </option>
              ))}
          </select>
        </div>

        <div className='col-12'>
          <Input
            isDisabled={
              !(
                address.districtName &&
                address.provinceName &&
                address.wardName
              )
            }
            type='text'
            name='street'
            label={t('addressForm.street')}
            value={address.street}
            isValid={address.isValidStreet}
            required
            maxLength='100'
            feedback={t('addressFormValid.streetValid')}
            validator='address'
            onChange={(value) => handleChange(value)}
            placeholder='Ví dụ: Số 58 Đường số 1'
          />
        </div>
        {error && (
          <div className='col-12'>
            <Error msg={error} />
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressForm
