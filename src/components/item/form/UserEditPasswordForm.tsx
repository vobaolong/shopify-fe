import { useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updatePassword } from '../../../apis/user.api'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Form, Input, Button, Spin, Modal } from 'antd'
import useInvalidate from '../../../hooks/useInvalidate'
import { useAntdApp } from '../../../hooks/useAntdApp'

const UserEditPasswordForm = () => {
  const { t } = useTranslation()
  const [form] = Form.useForm()
  const { _id } = getToken()
  const invalidate = useInvalidate()
  const { notification } = useAntdApp()
  const updatePasswordMutation = useMutation({
    mutationFn: (user: { currentPassword: string; newPassword: string }) =>
      updatePassword(_id, user),
    onSuccess: () => {
      form.resetFields()
      invalidate({ queryKey: ['userProfilePage', _id] })
      invalidate({ queryKey: ['userAccountInit', _id] })
      invalidate({ queryKey: ['adminProfilePage', _id] })
      notification.success({
        message: t('toastSuccess.userDetail.updatePassword')
      })
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  const handleFinish = (values: any) => {
    Modal.confirm({
      title: t('userDetail.changePassword'),
      content: t('userDetail.confirmChangePassword'),
      okText: t('button.save'),
      cancelText: t('button.cancel'),
      onOk: () => {
        updatePasswordMutation.mutate({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword
        })
      }
    })
  }

  return (
    <div className='position-relative'>
      {updatePasswordMutation.isPending && <Spin />}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        autoComplete='off'
      >
        <Form.Item
          label={t('userDetail.currentPw')}
          name='currentPassword'
          rules={[
            { required: true, message: t('userDetail.pwValid') },
            { min: 6, message: t('userDetail.pwValid') }
          ]}
        >
          <Input.Password autoComplete='current-password' />
        </Form.Item>
        <Form.Item
          label={t('userDetail.newPw')}
          name='newPassword'
          rules={[
            { required: true, message: t('passwordFeedback') },
            { min: 6, message: t('passwordFeedback') }
          ]}
        >
          <Input.Password autoComplete='new-password' />
        </Form.Item>
        <Form.Item>
          <Button
            type='primary'
            htmlType='submit'
            className='rounded-1 w-full'
            loading={updatePasswordMutation.isPending}
          >
            {t('button.save')}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UserEditPasswordForm
