import { useQuery } from '@tanstack/react-query'
import { listVariantByCategory } from '../../apis/variant.api'
import { Spin, Alert } from 'antd'
import MultiVariantValueSelector from '../selector/MultiVariantValueSelector'
import { useTranslation } from 'react-i18next'
import { VariantValueType } from '../../@types/entity.types'
import { useEffect, useState } from 'react'

interface VariantSelectorProps {
  defaultValue?: VariantValueType[]
  categoryId?: string
  onSet?: (values: VariantValueType[]) => void
}

const VariantSelector = ({
  defaultValue = [],
  categoryId = '',
  onSet
}: VariantSelectorProps) => {
  const { t } = useTranslation()
  const [selectedVariantValues, setSelectedVariantValues] = useState<
    VariantValueType[]
  >([])

  const { data, isLoading, error } = useQuery({
    queryKey: ['variants', categoryId],
    queryFn: () => listVariantByCategory(categoryId),
    enabled: !!categoryId
  })

  useEffect(() => {
    if (!categoryId) {
      setSelectedVariantValues([])
      if (onSet) onSet([])
    }
  }, [categoryId])

  useEffect(() => {
    if (defaultValue) {
      setSelectedVariantValues(defaultValue)
      if (onSet) onSet(defaultValue)
    }
  }, [defaultValue])

  const handleSet = (olds: VariantValueType[], news: VariantValueType[]) => {
    let newArray = [...selectedVariantValues]
    let newValues: VariantValueType[] = []
    let flag = true

    if (olds.length > news.length) {
      flag = false
      let temps = news.map((n) => n._id)
      olds.forEach((o) => {
        if (temps.indexOf(o._id) === -1) newValues.push(o)
      })
    } else {
      let temps = olds.map((o) => o._id)
      news.forEach((n) => {
        if (temps.indexOf(n._id) === -1) newValues.push(n)
      })
    }

    if (flag) {
      let temps = newArray.map((na) => na._id)
      newValues.forEach((nv) => {
        if (temps.indexOf(nv._id) === -1) newArray.push(nv)
      })
    } else {
      let temps = newArray.map((na) => na._id)
      newValues.forEach((nv) => {
        if (temps.indexOf(nv._id) !== -1)
          newArray.splice(temps.indexOf(nv._id), 1)
      })
    }

    setSelectedVariantValues(newArray)
    if (onSet) onSet(newArray)
  }

  const variants = data?.data?.variants || []
  const errorMessage = error
    ? 'Server Error'
    : data?.data?.error ||
      (variants.length <= 0 ? t('toastSuccess.variant.none') : '')
  return (
    <div className='row position-relative'>
      {isLoading && <Spin size='large' />}
      {errorMessage && (
        <span className='ms-2'>
          <Alert message={errorMessage} type='error' />
        </span>
      )}
      {variants.map((variant: VariantValueType, index: number) => (
        <div className='col mt-2' key={index}>
          <MultiVariantValueSelector
            defaultValue={defaultValue}
            categoryId={categoryId}
            variantId={variant._id}
            variantName={variant.name}
            onSet={handleSet}
          />
        </div>
      ))}
    </div>
  )
}

export default VariantSelector
