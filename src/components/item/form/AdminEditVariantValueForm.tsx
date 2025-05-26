import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth.api'
import { updateValue } from '../../../apis/variant.api'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import Error from '../../ui/Error'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { notification } from 'antd'

interface VariantValueType {
  _id: string
  name: string
  variantId: string
}

interface ValueState {
  _id: string
  name: string
  variantId: string
  isValidName: boolean
}

const AdminEditValueStyleForm = ({
  oldVariantValue,
  onRun
}: {
  oldVariantValue?: VariantValueType
  onRun?: () => void
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [newValue, setNewValue] = useState<ValueState>({
    _id: '',
    name: '',
    variantId: '',
    isValidName: true
  })

  const { _id } = getToken()

  useEffect(() => {
    if (oldVariantValue) {
      setNewValue({
        _id: oldVariantValue._id || '',
        name: oldVariantValue.name || '',
        variantId: oldVariantValue.variantId || '',
        isValidName: true
      })
    }
  }, [oldVariantValue])

  const handleChange = (
    name: keyof ValueState,
    isValidName: keyof ValueState,
    value: string
  ) => {
    setNewValue({
      ...newValue,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: keyof ValueState, flag: boolean) => {
    setNewValue({
      ...newValue,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { name, variantId, isValidName } = newValue
    if (!name || !variantId) {
      setNewValue({
        ...newValue,
        isValidName: regexTest('anything', name)
      })
      return
    }
    if (!isValidName) return
    onSubmit()
  }

  const onSubmit = () => {
    setIsLoading(true)
    updateValue(_id, newValue._id, newValue)
      .then((res: { data: { error?: string } }) => {
        if (res.data.error)
          notification.error({
            message: res.data.error
          })
        else {
          if (onRun) onRun()
          notification.success({
            message: t('toastSuccess.updateValue')
          })
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
        notification.error({
          message: 'Server Error'
        })
      })
  }

  return (
    <div className='position-relative'>
      {isLoading && <Loading />}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label={t('variantDetail.value.name')}
            value={newValue.name}
            isValid={newValue.isValidName}
            feedback='Please provide a valid value.'
            validator='anything'
            required={true}
            onChange={(value) => handleChange('name', 'isValidName', value)}
            onValidate={(flag) => handleValidate('isValidName', flag)}
          />
        </div>
        <div className='col-12 d-grid mt-4'>
          <button type='submit' className='btn btn-primary ripple rounded-1'>
            {t('button.submit')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditValueStyleForm
