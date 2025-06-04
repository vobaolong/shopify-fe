import { useEffect } from 'react'
import { Form, Input, Button, Rate, Spin } from 'antd'
import { StarOutlined, EditOutlined } from '@ant-design/icons'
import { getToken } from '../../../apis/auth.api'
import { updateReview } from '../../../apis/review.api'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface ReviewFormData {
  rating: number
  content: string
}

interface ReviewType {
  rating: number
  content: string
  _id: string
}

interface EditReviewFormProps {
  oldReview?: ReviewType
  onRun?: () => void
}

const EditReviewForm = ({ oldReview, onRun }: EditReviewFormProps) => {
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const [form] = Form.useForm()
  const { _id } = getToken()

  const updateReviewMutation = useMutation({
    mutationFn: (review: ReviewFormData) =>
      updateReview(_id, review, oldReview?._id || ''),
    onSuccess: (res: { data: { error?: string } }) => {
      if (res.data.error) {
        notification.error({ message: res.data.error })
      } else {
        if (onRun) {
          onRun()
          toast.success(t('toastSuccess.review.update'))
        }
      }
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    if (oldReview) {
      form.setFieldsValue({
        rating: oldReview.rating,
        content: oldReview.content
      })
    }
  }, [oldReview, form])

  const onFinish = (values: ReviewFormData) => {
    updateReviewMutation.mutate(values)
  }

  const validateRating = (_: any, value: number) => {
    if (!value || value < 1 || value > 5) {
      return Promise.reject(new Error(t('reviewDetail.isValid')))
    }
    return Promise.resolve()
  }

  return (
    <div className='relative'>
      <Spin spinning={updateReviewMutation.isPending}>
        <Form
          form={form}
          layout='vertical'
          onFinish={onFinish}
          initialValues={{
            rating: 1,
            content: ''
          }}
          className='space-y-4'
        >
          <Form.Item
            name='rating'
            label={t('reviewDetail.productQuality')}
            rules={[{ validator: validateRating }]}
          >
            <Rate character={<StarOutlined />} className='text-yellow-400' />
          </Form.Item>

          <Form.Item
            name='content'
            label={t('reviewDetail.content')}
            rules={[
              {
                max: 500,
                message: t('reviewDetail.isValid')
              }
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t('reviewDetail.content')}
              className='resize-none'
            />
          </Form.Item>

          <Form.Item className='mb-0'>
            <Button
              type='primary'
              htmlType='submit'
              loading={updateReviewMutation.isPending}
              icon={<EditOutlined />}
              className='w-full h-10 bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600'
            >
              {t('button.edit')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  )
}

export default EditReviewForm
