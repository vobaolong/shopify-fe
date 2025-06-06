import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getToken } from '../../../apis/auth.api'
import { createStore } from '../../../apis/store.api'
import { listActiveCommissions as getListCommissions } from '../../../apis/commission.api'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import AddressForm from './AddressForm'
import { sendCreateStoreEmail } from '../../../apis/notification.api'
import { useSelector } from 'react-redux'
import { socketId } from '../../../socket'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { useAntdApp } from '../../../hooks/useAntdApp'
import {
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  Spin,
  Alert,
  Typography,
  Card,
  Upload,
  message,
  Divider
} from 'antd'
import {
  ArrowLeftOutlined,
  UploadOutlined,
  ShopOutlined,
  FileImageOutlined
} from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'

const { Title, Text } = Typography
const { Option } = Select

interface UserCreateStoreFormProps {
  onSuccess?: () => void
}

const UserCreateStoreForm = ({ onSuccess }: UserCreateStoreFormProps = {}) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [addressDetail, setAddressDetail] = useState<any>({})
  const navigate = useNavigate()
  const { _id } = getToken()
  const user = useSelector((state: any) => state.account.user)

  const {
    data: commissionsData,
    isError: isCommissionsError,
    isLoading: isLoadingCommissions
  } = useQuery({
    queryKey: ['active-commissions'],
    queryFn: async () => {
      const res = await getListCommissions()
      return res
    }
  })

  const commissions = commissionsData?.commissions || []

  const createStoreMutation = useMutation({
    mutationFn: async (values: any) => {
      const formData = new FormData()
      formData.set('name', values.name)
      formData.set('bio', values.bio)
      formData.set('address', values.address)
      formData.set('commissionId', values.commissionId)

      if (values.avatar && values.avatar[0]?.originFileObj) {
        formData.set('avatar', values.avatar[0].originFileObj)
      }

      if (values.cover && values.cover[0]?.originFileObj) {
        formData.set('cover', values.cover[0].originFileObj)
      }

      formData.set('addressDetail', JSON.stringify(addressDetail))

      const res = await createStore(_id, formData)
      return (res as AxiosResponse<any>).data || res
    },
    onSuccess: (data) => {
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        socketId.emit('notificationShopNew', {
          objectId: '',
          from: user._id,
          to: import.meta.env.VITE_ADMIN_ID
        })
        sendCreateStoreEmail(user._id, data.storeId)
        toast.success(t('toastSuccess.store.create'))

        if (onSuccess) {
          onSuccess()
        } else {
          navigate(`/seller/${data.storeId}`)
        }
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })
  const handleFinish = (values: any) => {
    if (!addressDetail || !addressDetail.street) {
      notification.error({ message: t('storeDetailValid.addressValid') })
      return
    }

    if (values.name.toLowerCase().includes('shopbase')) {
      notification.error({ message: 'Tên gian hàng không được chứa tên sàn' })
      return
    }

    setIsConfirming(true)
  }

  const handleAddressChange = (value: any) => {
    setAddressDetail(value)
    form.setFieldsValue({ address: value.street })
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }

  const onSubmit = () => {
    const values = form.getFieldsValue()
    createStoreMutation.mutate(values)
    setIsConfirming(false)
  }
  return (
    <div className='w-full'>
      <Spin spinning={createStoreMutation.isPending}>
        {isConfirming && (
          <ConfirmDialog
            title={t('dialog.createStore')}
            message={
              <div className='text-sm'>
                {t('storeDetail.agreeBy')}{' '}
                <Link
                  to='/legal/privacy'
                  target='_blank'
                  className='text-blue-500 hover:underline'
                >
                  {t('footer.policy')}
                </Link>
                <br />
                {t('storeDetail.getPaid')}{' '}
                <Link
                  to='/legal/sell-on-shopbase'
                  target='_blank'
                  className='text-blue-500 hover:underline'
                >
                  {t('storeDetail.sellOn')}
                </Link>
              </div>
            }
            onSubmit={onSubmit}
            onClose={() => setIsConfirming(false)}
          />
        )}

        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          className='w-full'
          initialValues={{
            name: '',
            bio: '',
            address: '',
            commissionId:
              commissions?.length > 0 && commissions[0]?._id
                ? commissions[0]._id
                : ''
          }}
          requiredMark={true}
        >
          {/* Basic Info Section */}
          <Card title={t('storeDetail.basicInfo')}>
            {isCommissionsError && (
              <Alert
                message={isCommissionsError}
                type='error'
                className='mb-4'
                showIcon
              />
            )}
            <Form.Item
              name='commissionId'
              label={t('storeDetail.typeOfStall')}
              tooltip={t('storeDetail.commissionTooltip')}
              rules={[
                {
                  required: true,
                  message: t('storeDetailValid.commissionValid')
                }
              ]}
            >
              <Select
                loading={isLoadingCommissions}
                placeholder={t('storeDetail.selectCommission')}
              >
                {commissions
                  ?.filter((c: any) => c && c._id)
                  .map((c: any) => (
                    <Option key={c._id} value={c._id}>
                      {c.name} ({c.fee?.$numberDecimal || 0}%/{t('order')})
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='name'
              label={t('storeDetail.storeName')}
              rules={[
                { required: true, message: t('storeDetailValid.validName') },
                { min: 2, message: t('storeDetailValid.validName') },
                { max: 50, message: t('storeDetailValid.validName') }
              ]}
            >
              <Input
                placeholder='Ví dụ: Cửa hàng giày ABC'
                showCount
                maxLength={50}
              />
            </Form.Item>
            <Form.Item
              name='bio'
              label='Bio'
              rules={[
                { required: true, message: t('storeDetailValid.bioValid') },
                { min: 10, message: t('storeDetailValid.bioValid') },
                { max: 200, message: t('storeDetailValid.bioValid') }
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder='Ví dụ: Chào mừng bạn đến với Cửa hàng giày ABC! Chúng tôi tự hào là địa chỉ tin cậy cho những tín đồ yêu giày, mang đến những mẫu giày thời trang, chất lượng và phong cách.'
                maxLength={200}
                autoSize={{ minRows: 3, maxRows: 8 }}
              />
            </Form.Item>
            <Form.Item
              name='address'
              hidden
              label={t('storeDetail.address')}
              rules={[
                { required: true, message: t('storeDetailValid.addressValid') }
              ]}
            >
              <Input />
            </Form.Item>
            <div className='border p-4 rounded-lg'>
              <Title level={5} className='text-gray-700 mb-4'>
                {t('storeDetail.address')}
              </Title>
              <AddressForm onChange={handleAddressChange} />
            </div>
          </Card>
          <Card className='mt-3' title={t('storeDetail.imgInfo')}>
            <div className='grid grid-cols-1 md:grid-cols-12 gap-6'>
              <div className='col-span-1 md:col-span-3'>
                <Form.Item
                  name='avatar'
                  label={
                    <span className='font-medium'>
                      {t('storeDetail.avatar')}
                    </span>
                  }
                  valuePropName='fileList'
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: t('storeDetailValid.avatarValid')
                    }
                  ]}
                  help={
                    <Text type='secondary' className='text-xs'>
                      Recommended size: 200x200px
                    </Text>
                  }
                >
                  <ImgCrop rotationSlider aspect={1}>
                    <Upload
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={() => false}
                      accept='image/jpeg,image/png'
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <UploadOutlined />
                        <div className='mt-2'>{t('upload')}</div>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </div>
              <div className='col-span-1 md:col-span-9'>
                <Form.Item
                  name='cover'
                  label={
                    <span className='font-medium'>
                      {t('storeDetail.cover')}
                    </span>
                  }
                  valuePropName='fileList'
                  getValueFromEvent={normFile}
                  rules={[
                    {
                      required: true,
                      message: t('storeDetailValid.coverValid')
                    }
                  ]}
                  help={                    <Text type='secondary' className='text-xs'>
                      Recommended size: 1200x200px
                    </Text>
                  }
                >
                  <ImgCrop rotationSlider aspect={6}>
                    <Upload
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={() => false}
                      accept='image/jpeg,image/png'
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <UploadOutlined />
                        <div className='mt-2'>{t('upload')}</div>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </div>
            </div>{' '}
          </Card>
          {!onSuccess && (
            <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white z-10`}>
              <div className='container mx-auto px-4'>
                <div className='flex flex-col md:flex-row justify-between items-center'>
                  <Link
                    to='/account/store'
                    className='text-blue-500 hover:text-blue-700 flex items-center mb-4 md:mb-0'
                  >
                    <ArrowLeftOutlined className='mr-2' />
                    {t('storeDetail.backToStore')}
                  </Link>

                  <div className='text-center mb-4 md:mb-0 flex flex-col items-center'>
                    <Text className='text-gray-500 text-sm'>
                      {t('storeDetail.getPaid')}{' '}
                      <Link
                        to='/legal/sell-on-shopbase'
                        target='_blank'
                        className='text-blue-500 hover:underline'
                      >
                        {t('storeDetail.sellOn')}
                      </Link>
                    </Text>
                    <div className='mt-2'>
                      <Checkbox
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                      >
                        <Text className='text-gray-500 text-sm'>
                          {t('storeDetail.agreeBy')}{' '}
                          <Link
                            to='/legal/privacy'
                            target='_blank'
                            className='text-blue-500 hover:underline'
                          >
                            {t('footer.policy')}
                          </Link>
                        </Text>
                      </Checkbox>
                    </div>
                  </div>

                  <Button
                    type='primary'
                    htmlType='submit'
                    disabled={!isChecked}
                    loading={createStoreMutation.isPending}
                    className='w-full md:w-48'
                    size='large'
                  >
                    {t('button.submit')}
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Drawer Footer - Only show when in drawer */}
          {onSuccess && (
            <div className='border-t bg-gray-50 -mx-6 px-6 pb-6'>
              <div className='flex flex-col space-y-4'>
                <div className='text-center'>
                  <Text className='text-gray-500 text-sm'>
                    {t('storeDetail.getPaid')}{' '}
                    <Link
                      to='/legal/sell-on-shopbase'
                      target='_blank'
                      className='text-blue-500 hover:underline'
                    >
                      {t('storeDetail.sellOn')}
                    </Link>
                  </Text>
                  <div className='mt-2'>
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                    >
                      <Text className='text-gray-500 text-sm'>
                        {t('storeDetail.agreeBy')}{' '}
                        <Link
                          to='/legal/privacy'
                          target='_blank'
                          className='text-blue-500 hover:underline'
                        >
                          {t('footer.policy')}
                        </Link>
                      </Text>
                    </Checkbox>
                  </div>
                </div>

                <Button
                  type='primary'
                  htmlType='submit'
                  disabled={!isChecked}
                  loading={createStoreMutation.isPending}
                  className='w-full'
                  size='large'
                >
                  {t('button.submit')}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Spin>
    </div>
  )
}

export default UserCreateStoreForm
