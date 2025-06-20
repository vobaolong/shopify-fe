import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createCategory,
  updateCategory,
  getCategoryById
} from '../../../apis/category.api'
import CategorySelector from '../../selector/CategorySelector'
import { useTranslation } from 'react-i18next'
import {
  Form,
  Input,
  Button,
  Modal,
  Row,
  Col,
  Upload,
  UploadProps,
  Spin,
  Image
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import type { UploadFile } from 'antd/es/upload/interface'
import { useAntdApp } from '../../../hooks/useAntdApp'

interface Props {
  categoryId?: string
  onSuccess?: () => void
}

const getBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const AdminUpsertCategoryForm = ({ categoryId, onSuccess }: Props) => {
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const { notification } = useAntdApp()
  const navigate = useNavigate()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [formState, setFormState] = useState({
    selectedCategory: null as any,
    previewOpen: false,
    previewImage: '',
    isLoading: false
  })
  const isEdit = !!categoryId
  const mutation = useMutation({
    mutationFn: (formData: FormData) =>
      isEdit && categoryId
        ? updateCategory(categoryId, formData)
        : createCategory(formData),
    onSuccess: (res: any) => {
      notification.success({
        message: t(
          isEdit
            ? 'toastSuccess.category.update'
            : 'toastSuccess.category.create'
        )
      })

      if (onSuccess) onSuccess()
      else navigate('/admin/categories')
    },
    onError: () => {
      notification.error({ message: 'Server Error' })
    }
  })

  useEffect(() => {
    if (!isEdit) {
      setFormState((prev) => ({
        ...prev,
        selectedCategory: null
      }))
      form.resetFields()
      setFileList([])
      return
    }

    setFormState((prev) => ({
      ...prev,
      isLoading: true
    }))
    getCategoryById(categoryId!)
      .then((res) => {
        const category = (res as any).category
        if (category) {
          const parentCategory = category.categoryId || null

          setFormState((prev) => ({
            ...prev,
            selectedCategory: parentCategory
          }))

          form.setFieldsValue({
            name: category.name,
            categoryId: parentCategory?._id || null
          })

          if (category.image) {
            setFileList([
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: category.image
              }
            ])
          }
        }
        setFormState((prev) => ({
          ...prev,
          isLoading: false
        }))
      })
      .catch(() => {
        notification.error({ message: 'Server Error' })
        setFormState((prev) => ({
          ...prev,
          isLoading: false
        }))
      })
  }, [categoryId, form, isEdit, notification])

  const handleFinish = () => {
    Modal.confirm({
      title: t(isEdit ? 'dialog.updateCategory' : 'categoryDetail.add'),
      content: t(isEdit ? 'message.edit' : 'confirmDialog'),
      okText: t('button.confirm'),
      cancelText: t('button.cancel'),
      onOk: handleConfirmSubmit
    })
  }

  const handleConfirmSubmit = () => {
    const values = form.getFieldsValue()

    const formData = new FormData()
    formData.set('name', values.name)

    if (values.categoryId && values.categoryId !== categoryId) {
      formData.set('categoryId', values.categoryId)
    }

    if (fileList.length > 0) {
      const file = fileList[0]

      if (file.originFileObj) {
        formData.set('image', file.originFileObj)
      }
    }

    mutation.mutate(formData)
  }

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }
    setFormState((prev) => ({
      ...prev,
      previewImage: file.url || (file.preview as string),
      previewOpen: true
    }))
  }
  const uploadProps: UploadProps = {
    fileList,
    onPreview: handlePreview,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        notification.error({ message: 'You can only upload image files!' })
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        notification.error({ message: 'Image must smaller than 2MB!' })
        return false
      }
      return false
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1))
    },
    onRemove: () => {
      setFileList([])
    },
    maxCount: 1,
    listType: 'picture',
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false
    }
  }
  return (
    <div className='relative'>
      {(formState.isLoading || mutation.isPending) && <Spin />}
      <Form
        form={form}
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{ name: '' }}
      >
        <Row gutter={[4, 4]}>
          <Col span={24}>
            <Form.Item name='categoryId'>
              <CategorySelector
                key={categoryId || 'create'}
                label={t('categoryDetail.chosenParentCategory')}
                isActive={false}
                value={formState.selectedCategory}
                onChange={(category: any) => {
                  setFormState((prev) => ({
                    ...prev,
                    selectedCategory: category
                  }))
                  form.setFieldsValue({ categoryId: category?._id || null })
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name='name'
              label={t('categoryDetail.name')}
              rules={[
                { required: true, message: t('categoryValid.validName') }
              ]}
            >
              <Input placeholder={t('categoryDetail.name')} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label={t('categoryDetail.img')} required>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>
                  {t('categoryDetail.img')}
                </Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={24} className='text-right'>
            <Button className='min-w-[200px]' type='primary' htmlType='submit'>
              {t('button.save')}
            </Button>
          </Col>
        </Row>
      </Form>
      {formState.previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: formState.previewOpen,
            onVisibleChange: (visible) =>
              setFormState((prev) => ({ ...prev, previewOpen: visible })),
            afterOpenChange: (visible) =>
              !visible &&
              setFormState((prev) => ({ ...prev, previewImage: '' }))
          }}
          src={formState.previewImage}
        />
      )}
    </div>
  )
}

export default AdminUpsertCategoryForm
