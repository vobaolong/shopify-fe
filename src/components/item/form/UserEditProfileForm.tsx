import { useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateProfile } from '../../../apis/user.api'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, notification, Spin, Modal } from 'antd'
import useInvalidate from '../../../hooks/useInvalidate'
import { UserType } from '../../../@types/entity.types'

interface UserEditProfileFormProps {
  userName?: string
  name?: string
  email?: string
  phone?: string
  id_card?: string
  googleId?: boolean
}

const UserEditProfileForm = ({
  userName = '',
  name = '',
  email = '',
  phone = '',
  id_card = '',
  googleId = false
}: UserEditProfileFormProps) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { _id } = getToken()
  const invalidate = useInvalidate()

  const updateProfileMutation = useMutation({
    mutationFn: (user: UserType) => updateProfile(_id, user),
    onSuccess: () => {
      invalidate({ queryKey: ['userProfile', _id] })
      notification.success({
        message: t('toastSuccess.userDetail.updateProfile')
      })
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  useEffect(() => {
    form.setFieldsValue({
      userName,
      name,
      email,
      phone,
      id_card
    })
  }, [userName, name, email, phone, id_card, form])

  const handleFinish = (values: any) => {
    Modal.confirm({
      title: t('userDetail.editProfile'),
      content: t('userDetail.confirmEditProfile'),
      okText: t('button.save'),
      cancelText: t('button.cancel'),
      onOk: () => {
        let user: UserType = {
          _id,
          userName: values.userName,
          name: values.name,
          phone: values.phone,
          id_card: values.id_card,
          email: values.email,
          avatar: '',
          role: '',
          isEmailActive: false
        }
        if (!googleId && values.email) user.email = values.email
        if (values.phone) user.phone = values.phone
        if (values.id_card) user.id_card = values.id_card
        updateProfileMutation.mutate(user)
      }
    })
  }

  return (
    <div className='position-relative'>
      {updateProfileMutation.isPending && <Spin />}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          userName,
          name,
          email,
          phone,
          id_card
        }}
      >
        <Form.Item
          label={t('userDetail.userName')}
          name='userName'
          rules={[
            { required: true, message: t('userDetail.validFirstName') },
            { min: 2, message: t('userDetail.validFirstName') }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t('userDetail.name')}
          name='name'
          rules={[
            { required: true, message: t('userDetail.validLastName') },
            { min: 2, message: t('userDetail.validLastName') }
          ]}
        >
          <Input />
        </Form.Item>
        {!googleId && (
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: t('userDetail.emailValid') },
              { type: 'email', message: t('userDetail.emailValid') }
            ]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item
          label={t('userDetail.phone')}
          name='phone'
          rules={[
            { required: true, message: t('userDetail.phoneValid') },
            { pattern: /^\d{9,11}$/, message: t('userDetail.phoneValid') }
          ]}
        >
          <Input />
        </Form.Item>
        {/* ID Card is optional for admin users, but required for others */}
        {userName !== 'admin' && (
          <Form.Item
            label={t('userDetail.idCard')}
            name='id_card'
            rules={[
              { required: true, message: t('userDetail.idCardValid') },
              { pattern: /^\d{9,12}$/, message: t('userDetail.idCardValid') }
            ]}
          >
            <Input />
          </Form.Item>
        )}
        <Form.Item>
          <Button type='primary' htmlType='submit' className='rounded-1 w-full'>
            {t('button.save')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserEditProfileForm
