import { useQuery } from '@tanstack/react-query'
import { listVariantByCategory } from '../../apis/variant.api'
import { Spin, Alert } from 'antd'
import MultiVariantValueSelector from '../selector/MultiVariantValueSelector'
import { useTranslation } from 'react-i18next'
import { VariantValueType } from '../../@types/entity.types'
import { useEffect, useState, useRef } from 'react'

interface VariantSelectorProps {
  defaultValue?: VariantValueType[]
  categoryId?: string
  onSet?: (values: VariantValueType[]) => void
}

interface Variant {
  _id: string
  name: string
  categoryIds: any[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
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
  const isInitialized = useRef(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['variants', categoryId],
    queryFn: async () => {
      const result = await listVariantByCategory(categoryId)
      return result
    },
    enabled: !!categoryId,
    retry: 1,
    staleTime: 30000
  })

  useEffect(() => {
    if (!categoryId) {
      setSelectedVariantValues([])
      if (onSet) onSet([])
    }
  }, [categoryId, onSet])

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0 && !isInitialized.current) {
      setSelectedVariantValues(defaultValue)
      if (onSet) onSet(defaultValue)
      isInitialized.current = true
    }
  }, [defaultValue, onSet])

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

  const variants: Variant[] =
    data?.variants?.filter(
      (variant: Variant) =>
        !variant.isDeleted &&
        variant.categoryIds.some((cat) =>
          typeof cat === 'string' ? cat === categoryId : cat._id === categoryId
        )
    ) || []

  const errorMessage = !categoryId
    ? t('productDetail.chooseCateFirst')
    : error
      ? 'Server Error'
      : data?.error
        ? typeof data.error === 'string'
          ? data.error
          : data.error?.message || 'Error occurred'
        : !isLoading && data && variants.length <= 0
          ? t('toastSuccess.variant.none')
          : ''

  return (
    <div className='row position-relative'>
      {isLoading && <Spin size='large' />}
      {errorMessage && (
        <span className='ms-2'>
          <Alert message={errorMessage} type='warning' />
        </span>
      )}
      {variants.map((variant: Variant) => (
        <div className='col mt-2' key={variant._id}>
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
