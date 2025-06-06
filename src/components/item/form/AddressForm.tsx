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
import { useQuery } from '@tanstack/react-query'

interface AddressFormProps {
  addressDetail?: AddressDetail
  onChange: (address: any) => void
}

const AddressForm: React.FC<AddressFormProps> = ({
  addressDetail,
  onChange
}) => {
  const { t } = useTranslation()
  const [address, setAddress] = useState({
    province: addressDetail?.provinceID ?? '',
    provinceName: addressDetail?.provinceName ?? '',
    district: addressDetail?.districtID ?? '',
    districtName: addressDetail?.districtName ?? '',
    ward: addressDetail?.wardCode ?? '',
    wardName: addressDetail?.wardName ?? '',
    street: addressDetail?.address?.split(', ')[0] ?? ''
  })

  // TanStack Query
  const {
    data: provinces = [],
    isLoading: isProvincesLoading,
    error: provincesError
  } = useQuery({
    queryKey: ['provinces'],
    queryFn: getProvincesGHN
  })

  const {
    data: districts = [],
    isLoading: isDistrictsLoading,
    error: districtsError
  } = useQuery({
    queryKey: ['districts', address.province],
    queryFn: () =>
      address.province
        ? getDistrictsGHN(address.province)
        : Promise.resolve([]),
    enabled: !!address.province
  })

  const {
    data: wards = [],
    isLoading: isWardsLoading,
    error: wardsError
  } = useQuery({
    queryKey: ['wards', address.district],
    queryFn: () =>
      address.district ? getWardsGHN(address.district) : Promise.resolve([]),
    enabled: !!address.district
  })

  const isLoading = isProvincesLoading || isDistrictsLoading || isWardsLoading
  const error = provincesError || districtsError || wardsError

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
        {error && (
          <Alert
            message={error.message || 'Lỗi tải dữ liệu'}
            type='error'
            showIcon
          />
        )}
        <Form.Item label={t('addressForm.province')} required>
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
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            virtual={false}
            options={provinces
              .slice()
              .sort((a: Province, b: Province) =>
                a.ProvinceName.localeCompare(b.ProvinceName)
              )
              .map((province: Province) => ({
                value: province.ProvinceID,
                label: province.ProvinceName
              }))}
          />
        </Form.Item>
        <Form.Item label={t('addressForm.district')} required>
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
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            virtual={false}
            options={districts
              .slice()
              .sort((a: District, b: District) =>
                a.DistrictName.localeCompare(b.DistrictName)
              )
              .map((district: District) => ({
                value: district.DistrictID,
                label: district.DistrictName
              }))}
          />
        </Form.Item>
        <Form.Item label={t('addressForm.ward')} required>
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
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            virtual={false}
            options={wards
              .slice()
              .sort((a: Ward, b: Ward) => a.WardName.localeCompare(b.WardName))
              .map((ward: Ward) => ({
                value: ward.WardCode,
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
            // disabled={
            //   !(
            //     address.provinceName &&
            //     address.districtName &&
            //     address.wardName
            //   )
            // }
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
