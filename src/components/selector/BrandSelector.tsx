/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { listVariantByCategory } from '../../apis/variant.api'
import Loading from '../ui/Loading'
import MultiVariantValueSelector from '../selector/MultiVariantValueSelector'
import Error from '../ui/Error'
import { useTranslation } from 'react-i18next'
import { VariantValueType } from '../../@types/entity.types'

interface Variant {
  _id: string
  name: string
  // add other fields as needed
}

interface BrandSelectorProps {
  defaultValue?: VariantValueType[]
  categoryId?: string
  onSet?: (values: VariantValueType[]) => void
}

const BrandSelector: React.FC<BrandSelectorProps> = ({
  defaultValue = [],
  categoryId = '',
  onSet
}) => {
  const { t } = useTranslation()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [variants, setVariants] = useState<Variant[]>([])
  const [selectedVariantValues, setSelectedVariantValues] = useState<
    VariantValueType[]
  >([])

  const init = () => {
    setIsLoading(true)
    setError('')
    listVariantByCategory(categoryId)
      .then((res) => {
        const data = res.data
        if (data.error) setError(data.error)
        else {
          setVariants(data.variants)
          if (data.variants.length <= 0)
            setError(t('toastSuccess.variant.none'))
        }
        setIsLoading(false)
      })
      .catch(() => {
        setError('Server Error')
        setIsLoading(false)
      })
  }

  useEffect(() => {
    if (categoryId) init()
    else setVariants([])

    setSelectedVariantValues([])
    if (onSet) onSet([])
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

  return (
    <div className='row position-relative'>
      {isLoading && <Loading />}
      {error && (
        <span className='ms-2'>
          <Error msg={error} />
        </span>
      )}
      {variants.map((variant: Variant, index: number) => (
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

export default BrandSelector
