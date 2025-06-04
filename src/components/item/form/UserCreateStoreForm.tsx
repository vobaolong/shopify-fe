/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
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
  PlusOutlined,
  ShopOutlined,
  FileImageOutlined
} from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const UserCreateStoreForm = () => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const [isConfirming, setIsConfirming] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [addressDetail, setAddressDetail] = useState<any>({})
  const navigate = useNavigate()
  const { _id } = getToken()
  const user = useSelector((state: any) => state.account.user)

  // Query for active commissions
  const {
    data: commissionsData,
    isError: isCommissionsError,
    isLoading: isLoadingCommissions
  } = useQuery({
    queryKey: ['active-commissions'],
    queryFn: async () => {
      const res = await getListCommissions()
      return (res as AxiosResponse<any>).data || res
    }
  })

  const commissions = commissionsData?.commissions || []
  const commissionError = isCommissionsError ? 'Failed to load commissions' : ''

  // Mutation for createStore
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
          to: import.meta.env.ADMIN_ID
        })
        sendCreateStoreEmail(user._id, data.storeId)
        toast.success(t('toastSuccess.store.create'))
        navigate(`/seller/${data.storeId}`)
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

  // Normalize file for Ant Design Upload
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e
    }
    return e?.fileList
  }
  useEffect(() => {
    const checkScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight
      setIsScrolled(!isBottom)
    }
    window.addEventListener('scroll', checkScroll)
    return () => {
      window.removeEventListener('scroll', checkScroll)
    }
  }, [])

  const onSubmit = () => {
    const values = form.getFieldsValue()
    createStoreMutation.mutate(values)
    setIsConfirming(false)
  }
  return (
    <div className='relative w-full'>
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

        <div className='mb-6'>
          <div className='flex items-center mb-2'>
            <ShopOutlined className='text-blue-500 text-xl mr-2' />
            <Title level={3} className='m-0'>
              {t('storeDetail.createStoreTitle')}
            </Title>
          </div>
          <Text type='secondary' className='text-sm'>
            {t('storeDetail.createStoreDesc')}
          </Text>
        </div>

        <Form
          form={form}
          layout='vertical'
          onFinish={handleFinish}
          className='w-full'
          initialValues={{
            name: '',
            bio: '',
            address: '',
            commissionId: commissions[0]?._id || ''
          }}
          requiredMark={true}
        >
          {' '}
          {/* Basic Info Section */}
          <Card
            className='mb-6 shadow-sm rounded-lg'
            title={
              <div className='flex items-center'>
                <ShopOutlined className='text-blue-500 mr-2' />
                <Title level={5} className='text-gray-700 m-0'>
                  {t('storeDetail.basicInfo')}
                </Title>
              </div>
            }
          >
            {commissionError && (
              <Alert
                message={commissionError}
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
                className='w-full'
                size='large'
              >
                {commissions?.map((c: any) => (
                  <Option key={c._id} value={c._id}>
                    {c.name} ({c.fee.$numberDecimal}%/{t('order')})
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
              <Input placeholder='Ví dụ: Cửa hàng giày ABC' size='large' />
            </Form.Item>

            <Form.Item
              name='bio'
              label='Bio'
              rules={[
                { required: true, message: t('storeDetailValid.bioValid') },
                { min: 10, message: t('storeDetailValid.bioValid') }
              ]}
            >
              <TextArea
                rows={5}
                placeholder='Ví dụ: Chào mừng bạn đến với Cửa hàng giày ABC! Chúng tôi tự hào là địa chỉ tin cậy cho những tín đồ yêu giày, mang đến những mẫu giày thời trang, chất lượng và phong cách.'
                className='resize-none'
                showCount
                maxLength={500}
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

            <div className='border p-4 rounded-lg bg-gray-50'>
              <Title level={5} className='text-gray-700 mb-4'>
                {t('storeDetail.address')}
              </Title>
              <AddressForm onChange={handleAddressChange} />
            </div>
          </Card>{' '}
          {/* Image Info Section */}
          <Card
            className='mb-16 shadow-sm rounded-lg'
            title={
              <div className='flex items-center'>
                <FileImageOutlined className='text-blue-500 mr-2' />
                <Title level={5} className='text-gray-700 m-0'>
                  {t('storeDetail.imgInfo')}
                </Title>
              </div>
            }
          >
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
                        <PlusOutlined />
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
                  help={
                    <Text type='secondary' className='text-xs'>
                      Recommended size: 1200x300px
                    </Text>
                  }
                >
                  <ImgCrop rotationSlider aspect={4}>
                    <Upload
                      listType='picture-card'
                      maxCount={1}
                      beforeUpload={() => false}
                      accept='image/jpeg,image/png'
                    >
                      <div className='flex flex-col items-center justify-center'>
                        <PlusOutlined />
                        <div className='mt-2'>{t('upload')}</div>
                      </div>
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </div>
            </div>
          </Card>
          {/* Sticky Footer */}
          <div
            className={`fixed bottom-0 left-0 right-0 p-4 bg-white border-t ${
              isScrolled ? 'shadow-lg' : ''
            } z-10`}
          >
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
        </Form>
      </Spin>
    </div>
  )
}

export default UserCreateStoreForm
