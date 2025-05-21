/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { getToken } from '../../../apis/auth'
import { createValue } from '../../../apis/variant'
import { regexTest } from '../../../helper/test'
import Input from '../../ui/Input'
import Loading from '../../ui/Loading'
import ConfirmDialog from '../../ui/ConfirmDialog'
import { useTranslation } from 'react-i18next'
import Error from '../../ui/Error'
import { useMutation } from '@tanstack/react-query'
import useInvalidate from '../../../hooks/useInvalidate'
import { notification } from 'antd'

interface AddVariantValueFormProps {
  variantId: string
  variantName: string
  onRun?: () => void
}

const AddVariantValueForm = ({
  variantId,
  variantName,
  onRun
}: AddVariantValueFormProps) => {
  const invalidate = useInvalidate()
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [newValue, setNewValue] = useState({
    name: '',
    variantId,
    variantName,
    isValidName: true
  })

  const { _id } = getToken()
  useEffect(() => {
    setNewValue({
      ...newValue,
      variantId,
      variantName
    })
  }, [variantId])

  const handleChange = (name: string, isValidName: string, value: string) => {
    setNewValue({
      ...newValue,
      [name]: value,
      [isValidName]: true
    })
  }

  const handleValidate = (isValidName: string, flag: boolean) => {
    setNewValue({
      ...newValue,
      [isValidName]: flag
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { name, variantId } = newValue
    if (!name || !variantId) {
      setNewValue({
        ...newValue,
        isValidName: regexTest('anything', name)
      })
      return
    }
    const { isValidName } = newValue
    if (!isValidName) return
    setIsConfirming(true)
  }

  const createValueMutation = useMutation({
    mutationFn: () => createValue(_id, newValue),
    onSuccess: (res) => {
      const data = res.data
      if (data.error) {
        notification.error({ message: data.error })
      } else {
        setNewValue({
          ...newValue,
          name: ''
        })
        if (onRun) onRun()
        notification.success({ message: t('toastSuccess.variantValue.add') })
        invalidate({ queryKey: ['variants'] })
      }
    },
    onError: () => {
      notification.error({ message: 'Server error' })
    }
  })

  const onSubmit = () => {
    createValueMutation.mutate()
  }

  return (
    <div className='position-relative'>
      {createValueMutation.isPending && <Loading />}

      {isConfirming && (
        <ConfirmDialog
          title={`${t('addValue')} ${variantName}`}
          onSubmit={onSubmit}
          onClose={() => setIsConfirming(false)}
          message={t('confirmDialog')}
        />
      )}

      <form className='row mb-2' onSubmit={handleSubmit}>
        <div className='col-12'>
          <Input
            type='text'
            label='Value'
            value={String(newValue.name)}
            isValid={newValue.isValidName}
            feedback='Please provide a valid value.'
            validator='anything'
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

export default AddVariantValueForm
