import { useState, useEffect } from 'react'
import axios from 'axios'
import { getToken } from '../../../apis/auth.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { addAddress } from '../../../apis/user.api'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { Form, Input, Select, Button, Spin, Alert, Modal, Space } from 'antd'
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

interface AddressFormProps {
  onSuccess?: () => void
}

const { Option } = Select

const UserAddAddressForm: React.FC<AddressFormProps> = ({ onSuccess }) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [isLoadingWards, setIsLoadingWards] = useState(false)
  const [error, setError] = useState('')
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
        form.resetFields()
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
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setIsLoadingProvinces(true)
        const { data } = await axios.get(getProvince, {
          headers: {
            Token: GHN_TOKEN
          }
        })
        setProvinces(data.data)
      } catch (error) {
        console.error('Error fetching provinces:', error)
        setError(t('addressForm.errorLoadingProvinces'))
      } finally {
        setIsLoadingProvinces(false)
      }
    }
    fetchProvinces()
  }, [])

  const fetchDistricts = async (provinceId: string) => {
    try {
      setIsLoadingDistricts(true)
      const districts = await getDistricts(provinceId)
      setDistricts(districts)
      return districts
    } catch (error) {
      console.error('Error fetching districts:', error)
      setError(t('addressForm.errorLoadingDistricts'))
      return []
    } finally {
      setIsLoadingDistricts(false)
    }
  }

  const fetchWards = async (districtId: string) => {
    try {
      setIsLoadingWards(true)
      const wards = await getWards(districtId)
      setWards(wards)
      return wards
    } catch (error) {
      console.error('Error fetching wards:', error)
      setError(t('addressForm.errorLoadingWards'))
      return []
    } finally {
      setIsLoadingWards(false)
    }
  }

  const handleProvinceChange = async (value: string) => {
    form.setFieldsValue({ district: undefined, ward: undefined, street: '' })
    setDistricts([])
    setWards([])

    if (value) {
      await fetchDistricts(value)
    }
  }

  const handleDistrictChange = async (value: string) => {
    form.setFieldsValue({ ward: undefined, street: '' })
    setWards([])

    if (value) {
      await fetchWards(value)
    }
  }

  const handleFinish = async (values: any) => {
    const province = provinces.find((p) => p.ProvinceID === values.province)
    const district = districts.find((d) => d.DistrictID === values.district)
    const ward = wards.find((w) => w.WardCode === values.ward)

    if (!province || !district || !ward) {
      setError(t('addressFormValid.allFields'))
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

    addAddressMutation.mutate(addressData)
  }

  return (
    <div className='w-full'>
      <Spin spinning={addAddressMutation.isPending}>
        {error && (
          <Alert
            message={error}
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
              loading={isLoadingProvinces}
              onChange={handleProvinceChange}
            >
              {provinces
                .slice()
                .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
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
              loading={isLoadingDistricts}
              onChange={handleDistrictChange}
            >
              {districts
                .slice()
                .sort((a, b) => a.DistrictName.localeCompare(b.DistrictName))
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
              loading={isLoadingWards}
            >
              {wards
                .slice()
                .sort((a, b) => a.WardName.localeCompare(b.WardName))
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
              disabled={!form.getFieldValue('ward')}
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
