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
  notification,
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
import UploadFileComponent from '../../image/UploadFile'

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
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
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
    if (!isEdit) return
    setIsLoading(true)
    getCategoryById(categoryId!)
      .then((res) => {
        const category = (res as any).category
        if (category) {
          form.setFieldsValue({
            name: category.name,
            categoryId: category.categoryId || null
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
        setIsLoading(false)
      })
      .catch(() => {
        notification.error({ message: 'Server Error' })
        setIsLoading(false)
      })
  }, [categoryId, form])

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

    if (
      values.categoryId &&
      values.categoryId._id &&
      values.categoryId._id !== categoryId
    ) {
      formData.set('categoryId', values.categoryId._id)
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.set('image', fileList[0].originFileObj)
    }
    mutation.mutate(formData)
  }
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
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
      {(isLoading || mutation.isPending) && <Spin />}
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
                label={t('categoryDetail.chosenParentCategory')}
                selected='parent'
                isActive={false}
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
              <UploadFileComponent
                fileList={fileList}
                setFileList={setFileList}
                maxCount={1}
                label={t('categoryDetail.img')}
                required
              />
            </Form.Item>
          </Col>
          <Col span={24} className='text-right'>
            <Button className='min-w-[200px]' type='primary' htmlType='submit'>
              {t('button.save')}
            </Button>
          </Col>
        </Row>
      </Form>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </div>
  )
}

export default AdminUpsertCategoryForm
