/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  getProvincesGHN,
  getDistrictsGHN,
  getWardsGHN
} from '../../../apis/address.api'
import { Input, Select, Form, Spin, Alert } from 'antd'
import {
  AddressDetail,
  District,
  Province,
  Ward
} from '../../../@types/address.type'

interface AddressFormProps {
  addressDetail?: AddressDetail
  onChange: (address: any) => void
}

const AddressForm: React.FC<AddressFormProps> = ({
  addressDetail,
  onChange
}) => {
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
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])

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

  const fetchDistricts = async (provinceId: string) => {
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

  const fetchWards = async (districtId: string) => {
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

  const handleProvinceChange = (value: string, option: any) => {
    const name = option?.label || ''
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

  const handleDistrictChange = (value: string, option: any) => {
    const name = option?.label || ''
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

  const handleWardChange = (value: string, option: any) => {
    const name = option?.label || ''
    setAddress({ ...address, ward: value, wardName: name })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
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
    <Spin spinning={isLoading}>
      <div className='grid grid-cols-1 gap-4'>
        {error && <Alert message={error} type='error' showIcon />}

        <Form.Item label={t('addressForm.province')} required className='mb-4'>
          <Select
            placeholder={t('addressForm.selectProvince')}
            value={address.province || undefined}
            onChange={handleProvinceChange}
            showSearch
            status={!address.province && address.street ? 'error' : ''}
            className='w-full'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={provinces
              .slice()
              .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
              .map((province) => ({
                value: province.ProvinceID,
                label: province.ProvinceName
              }))}
          />
        </Form.Item>

        <Form.Item label={t('addressForm.district')} required className='mb-4'>
          <Select
            placeholder={t('addressForm.selectDistrict')}
            value={address.district || undefined}
            onChange={handleDistrictChange}
            disabled={!address.province}
            showSearch
            status={
              address.province && !address.district && address.street
                ? 'error'
                : ''
            }
            className='w-full'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={districts
              .slice()
              .sort((a, b) => a.DistrictName.localeCompare(b.DistrictName))
              .map((district) => ({
                value: district.DistrictID,
                label: district.DistrictName
              }))}
          />
        </Form.Item>

        <Form.Item label={t('addressForm.ward')} required className='mb-4'>
          <Select
            placeholder={t('addressForm.selectWard')}
            value={address.ward || undefined}
            onChange={handleWardChange}
            disabled={!address.district}
            showSearch
            status={
              address.district && !address.ward && address.street ? 'error' : ''
            }
            className='w-full'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={wards
              .slice()
              .sort((a, b) => a.WardName.localeCompare(b.WardName))
              .map((ward) => ({
                value: ward.WardID,
                label: ward.WardName
              }))}
          />
        </Form.Item>

        <Form.Item
          label={t('addressForm.street')}
          required
          help={
            !(address.district && address.province && address.ward) &&
            address.street
              ? t('addressForm.completeSelections')
              : ''
          }
          validateStatus={
            !(address.district && address.province && address.ward) &&
            address.street
              ? 'error'
              : ''
          }
        >
          <Input
            disabled={
              !(
                address.districtName &&
                address.provinceName &&
                address.wardName
              )
            }
            value={address.street}
            onChange={handleChange}
            maxLength={100}
            placeholder='Ví dụ: Số 58 Đường số 1'
          />
        </Form.Item>
      </div>
    </Spin>
  )
}

export default AddressForm
