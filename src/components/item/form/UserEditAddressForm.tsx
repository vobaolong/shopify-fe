import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateAddress } from '../../../apis/user.api'
import useUpdateDispatch from '../../../hooks/useUpdateDispatch'
import { useTranslation } from 'react-i18next'
import { useAntdApp } from '../../../hooks/useAntdApp'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Input, Button, Spin, Alert, Modal, AutoComplete } from 'antd'

// Hàm fetch gợi ý địa chỉ từ Nominatim
async function fetchAddressSuggestions(query: string) {
  if (!query) return []
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
  )
  return await res.json()
}

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
  const [options, setOptions] = useState<any[]>([])
  const [fetching, setFetching] = useState(false)

  const [updateDispatch] = useUpdateDispatch()
  const { _id } = getToken()
  const queryClient = useQueryClient()
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
    if (oldAddress) {
      const addressParts = oldAddress.split(', ')
      form.setFieldsValue({
        street: addressParts[0] || '',
        ward: addressParts[1] || '',
        district: addressParts[2] || '',
        province: addressParts[3] || ''
      })
    }
  }, [oldAddress, index, form])

  const handleFinish = (values: any) => {
    setIsConfirming(true)
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()
    const addressString = `${values.street}, ${values.ward}, ${values.district}, ${values.province}`
    updateAddressMutation.mutate(addressString)
    setIsConfirming(false)
  }

  // Xử lý gợi ý địa chỉ
  const handleSearch = async (value: string) => {
    if (!value) {
      setOptions([])
      return
    }
    setFetching(true)
    const suggestions = await fetchAddressSuggestions(value)
    setOptions(
      suggestions.map((item: any) => ({
        value: item.display_name,
        label: (
          <div>
            <span style={{ fontWeight: 600 }}>
              {item.display_name.split(',')[0]}
            </span>
            <span style={{ color: '#888', marginLeft: 8 }}>
              {item.display_name.replace(item.display_name.split(',')[0], '')}
            </span>
          </div>
        )
      }))
    )
    setFetching(false)
  }

  return (
    <div className='w-full'>
      <Spin spinning={updateAddressMutation.isPending}>
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
            <AutoComplete
              options={options}
              onSearch={handleSearch}
              placeholder='Ví dụ: 33 M3'
              notFoundContent={fetching ? <Spin size='small' /> : null}
              filterOption={false}
            >
              <Input />
            </AutoComplete>
          </Form.Item>

          <Form.Item
            name='ward'
            label={t('addressForm.ward')}
            rules={[
              { required: true, message: t('addressFormValid.wardRequired') }
            ]}
          >
            <Input placeholder={t('addressForm.ward')} />
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
            <Input placeholder={t('addressForm.district')} />
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
            <Input placeholder={t('addressForm.province')} />
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
