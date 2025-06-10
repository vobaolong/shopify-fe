import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateAddress } from '../../../apis/user.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Form, Input, Button, Spin, Alert, Modal, Select } from 'antd'
import { Province, District, Ward } from '../../../@types/address.type'
import AddressService from '../../../services/address.service'

const { Option } = Select

interface UserEditAddressFormProps {
  oldAddress?: string
  index?: number | null
  onSuccess?: () => void
}

const UserEditAddressForm: React.FC<UserEditAddressFormProps> = ({
  oldAddress = '',
  index = null,
  onSuccess
}) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')

  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()
  const queryClient = useQueryClient()
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
  const apiError = provincesError || districtsError || wardsError

  const updateAddressMutation = useMutation({
    mutationFn: (addressString: string) =>
      updateAddress(_id, index ?? 0, { address: addressString }),
    onSuccess: (res) => {
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        updateDispatch('account', data.user)
        notification.success({ message: t('toastSuccess.address.update') })
        queryClient.invalidateQueries({ queryKey: ['user'] })
        if (onSuccess) {
          onSuccess()
        }
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  useEffect(() => {
    if (oldAddress && provinces.length > 0) {
      const addressParts = oldAddress.split(', ')
      if (addressParts.length >= 4) {
        const street = addressParts[0] || ''
        const wardName = addressParts[1] || ''
        const districtName = addressParts[2] || ''
        const provinceName = addressParts[3] || ''

        // Find province by name
        const province = provinces.find((p) => p.ProvinceName === provinceName)
        if (province) {
          setSelectedProvince(province.ProvinceID)
          form.setFieldsValue({
            street,
            ward: wardName,
            district: districtName,
            province: province.ProvinceID
          })
        } else {
          // Fallback to basic form values
          form.setFieldsValue({
            street,
            ward: wardName,
            district: districtName,
            province: provinceName
          })
        }
      }
    }
  }, [oldAddress, provinces, form])

  useEffect(() => {
    if (selectedProvince && districts.length > 0) {
      const values = form.getFieldsValue()
      const district = districts.find((d) => d.DistrictName === values.district)
      if (district) {
        setSelectedDistrict(district.DistrictID)
        form.setFieldsValue({ district: district.DistrictID })
      }
    }
  }, [districts, selectedProvince, form])

  useEffect(() => {
    if (selectedDistrict && wards.length > 0) {
      const values = form.getFieldsValue()
      const ward = wards.find((w) => w.WardName === values.ward)
      if (ward) {
        form.setFieldsValue({ ward: ward.WardCode })
      }
    }
  }, [wards, selectedDistrict, form])

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value)
    setSelectedDistrict('')
    form.setFieldsValue({ district: undefined, ward: undefined })
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
    form.setFieldsValue({ ward: undefined })
  }

  const handleFinish = (values: any) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    let addressString = ''

    if (selectedProvince && selectedDistrict && values.ward && values.street) {
      // Use the new structured approach
      const province = provinces.find((p) => p.ProvinceID === selectedProvince)
      const district = districts.find((d) => d.DistrictID === selectedDistrict)
      const ward = wards.find((w) => w.WardCode === values.ward)

      if (province && district && ward) {
        addressString = `${values.street}, ${ward.WardName}, ${district.DistrictName}, ${province.ProvinceName}`
      } else {
        addressString = `${values.street}, ${values.ward}, ${values.district}, ${values.province}`
      }
    } else {
      // Fallback to manual input
      addressString = `${values.street}, ${values.ward}, ${values.district}, ${values.province}`
    }

    updateAddressMutation.mutate(addressString)
    setIsConfirming(false)
  }
  return (
    <div className='w-full'>
      <Spin spinning={updateAddressMutation.isPending || isLoading}>
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

        {isConfirming && (
          <Modal
            title={t('userDetail.editAddress')}
            open={isConfirming}
            onOk={handleConfirmSubmit}
            onCancel={() => setIsConfirming(false)}
            okText={t('button.save')}
            cancelText={t('button.cancel')}
          >
            <p>{t('confirmDialog')}</p>
          </Modal>
        )}

        <Form form={form} layout='vertical' onFinish={handleFinish}>
          <Form.Item
            name='street'
            label={t('addressForm.street')}
            rules={[
              { required: true, message: t('addressFormValid.streetRequired') },
              { max: 100, message: t('addressFormValid.streetTooLong') }
            ]}
          >
            <Input placeholder='Ví dụ: 33 M3' />
          </Form.Item>

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
                .filter((province) => province.ProvinceName)
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
                .filter((district) => district.DistrictName)
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
                .filter((ward) => ward.WardName)
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

          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={updateAddressMutation.isPending}
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

export default UserEditAddressForm
