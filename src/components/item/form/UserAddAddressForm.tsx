import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { addAddress } from '../../../apis/user.api'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { Form, Input, Select, Button, Spin, Alert } from 'antd'
import { Province, District, Ward } from '../../../@types/address.type'
import AddressService from '../../../services/address.service'

const { Option } = Select

interface AddressFormProps {
  onSuccess?: () => void
}

const UserAddAddressForm: React.FC<AddressFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const [error, setError] = useState('')
  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  // TanStack Query for provinces
  const {
    data: provinces = [],
    isLoading: isProvincesLoading,
    error: provincesError
  } = useQuery<Province[]>({
    queryKey: ['provinces'],
    queryFn: () => AddressService.getProvinces()
  })

  // TanStack Query for districts
  const {
    data: districts = [],
    isLoading: isDistrictsLoading,
    error: districtsError
  } = useQuery<District[]>({
    queryKey: ['districts', selectedProvince],
    queryFn: () =>
      selectedProvince
        ? AddressService.getDistricts(selectedProvince)
        : Promise.resolve([]),
    enabled: !!selectedProvince
  })

  // TanStack Query for wards
  const {
    data: wards = [],
    isLoading: isWardsLoading,
    error: wardsError
  } = useQuery<Ward[]>({
    queryKey: ['wards', selectedDistrict],
    queryFn: () =>
      selectedDistrict
        ? AddressService.getWards(selectedDistrict)
        : Promise.resolve([]),
    enabled: !!selectedDistrict
  })

  const isLoading = isProvincesLoading || isDistrictsLoading || isWardsLoading
  const apiError = provincesError || districtsError || wardsError // Mutation for addAddress
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
        form.resetFields()
        setSelectedProvince('')
        setSelectedDistrict('')
        notification.success({ message: t('toastSuccess.address.add') })
        if (onSuccess) {
          onSuccess()
        }
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedDistrict('')
    form.setFieldsValue({ district: undefined, ward: undefined, street: '' })
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    form.setFieldsValue({ ward: undefined, street: '' })
  }
  const handleFinish = async (values: any) => {
    console.log('Form values:', values)

    const province = provinces.find((p) => p.ProvinceID === values.province)
    const district = districts.find((d) => d.DistrictID === values.district)
    const ward = wards.find((w) => w.WardCode === values.ward)

    console.log('Found province:', province)
    console.log('Found district:', district)
    console.log('Found ward:', ward)

    if (!province || !district || !ward) {
      setError(t('addressFormValid.allFields'))
      return
    }

    if (!values.street || values.street.trim() === '') {
      setError('Vui lòng nhập địa chỉ cụ thể')
      return
    }

    const addressString = `${values.street}, ${ward.WardName}, ${district.DistrictName}, ${province.ProvinceName}`
    const addressData = {
      provinceID: values.province,
      provinceName: province.ProvinceName,
      districtID: values.district,
      districtName: district.DistrictName,
      wardID: values.ward,
      wardName: ward.WardName,
      address: addressString
    }

    console.log('Address data to submit:', addressData)
    addAddressMutation.mutate(addressData)
  }
  return (
    <div className='w-full'>
      <Spin spinning={addAddressMutation.isPending || isLoading}>
        {(error || apiError) && (
          <Alert
            message={error || apiError?.message || 'Có lỗi xảy ra'}
            type='error'
            showIcon
            className='mb-4'
            closable
            onClose={() => setError('')}
          />
        )}

        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item
            name='province'
            label={t('addressForm.province')}
            rules={[
              {
                required: true,
                message: t('addressFormValid.provinceRequired')
              }
            ]}
          >
            <Select
              placeholder={t('addressForm.selectProvince')}
              loading={isProvincesLoading}
              onChange={handleProvinceChange}
              showSearch
              filterOption={(input, option) =>
                (option?.children?.toString() ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              virtual={false}
            >
              {provinces
                .filter((province) => province.ProvinceName) // Lọc ra các province có ProvinceName
                .slice()
                .sort((a, b) =>
                  (a.ProvinceName || '').localeCompare(b.ProvinceName || '')
                )
                .map((province) => (
                  <Option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='district'
            label={t('addressForm.district')}
            rules={[
              {
                required: true,
                message: t('addressFormValid.districtRequired')
              }
            ]}
          >
            <Select
              placeholder={t('addressForm.selectDistrict')}
              disabled={districts.length === 0}
              loading={isDistrictsLoading}
              onChange={handleDistrictChange}
              showSearch
              filterOption={(input, option) =>
                (option?.children?.toString() ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              virtual={false}
            >
              {districts
                .filter((district) => district.DistrictName) // Lọc ra các district có DistrictName
                .slice()
                .sort((a, b) =>
                  (a.DistrictName || '').localeCompare(b.DistrictName || '')
                )
                .map((district) => (
                  <Option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='ward'
            label={t('addressForm.ward')}
            rules={[
              { required: true, message: t('addressFormValid.wardRequired') }
            ]}
          >
            <Select
              placeholder={t('addressForm.selectWard')}
              disabled={wards.length === 0}
              loading={isWardsLoading}
              showSearch
              filterOption={(input, option) =>
                (option?.children?.toString() ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              virtual={false}
            >
              {wards
                .filter((ward) => ward.WardName) // Lọc ra các ward có WardName
                .slice()
                .sort((a, b) =>
                  (a.WardName || '').localeCompare(b.WardName || '')
                )
                .map((ward) => (
                  <Option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name='street'
            label={t('addressForm.street')}
            rules={[
              { required: true, message: t('addressFormValid.streetRequired') },
              { max: 100, message: t('addressFormValid.streetTooLong') }
            ]}
          >
            <Input
              placeholder='Ví dụ: Số 58 Đường số 1'
              disabled={wards.length === 0}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={addAddressMutation.isPending}
              className='w-full'
            >
              {t('button.save')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default UserAddAddressForm
