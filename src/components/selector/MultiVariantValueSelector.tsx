/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listActiveValues } from '../../apis/variant.api'
import { Spin, Alert, Tag, Button, Card, Empty } from 'antd'
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import AddVariantValueItem from '../item/AddVariantValueItem'
import { useTranslation } from 'react-i18next'
import { VariantValueType } from '../../@types/entity.types'

interface MultiVariantValueSelectorProps {
  defaultValue?: VariantValueType[]
  categoryId?: string
  variantId?: string
  variantName?: string
  onSet?: (olds: VariantValueType[], news: VariantValueType[]) => void
}

const MultiVariantValueSelector = ({
  defaultValue = [],
  categoryId = '',
  variantId = '',
  variantName = '',
  onSet
}: MultiVariantValueSelectorProps) => {
  const [selectedValues, setSelectedValues] = useState<VariantValueType[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  const { t } = useTranslation()

  const {
    data: response,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['variantValues', variantId, refreshKey],
    queryFn: async () => {
      if (!variantId) return { variantValues: [] }
      const result = await listActiveValues(variantId)
      return result.data || result
    },
    enabled: !!variantId,
    retry: 1,
    staleTime: 30000
  })

  const values = response?.variantValues || []

  let errorMessage = ''
  if (error) {
    errorMessage =
      typeof error === 'string' ? error : error?.message || 'Server Error'
  } else if (response?.error) {
    errorMessage =
      typeof response.error === 'string'
        ? response.error
        : response.error?.message || 'Error occurred'
  }
  useEffect(() => {
    const oldArray = selectedValues
    const newArray: VariantValueType[] = []

    setSelectedValues(newArray)
    if (onSet) onSet(oldArray, newArray)
  }, [variantId, categoryId])

  useEffect(() => {
    if (defaultValue && defaultValue.length > 0) {
      const oldArray = selectedValues
      const newArray = defaultValue.filter((v) => v.variantId._id === variantId)

      setSelectedValues(newArray)
      if (onSet) onSet(oldArray, newArray)
    }
  }, [defaultValue, variantId])

  const handleChoose = (value: VariantValueType) => {
    const oldArray = selectedValues
    const temp = oldArray.map((e) => e._id)

    if (temp.indexOf(value._id) === -1) {
      const newArray = [...oldArray, value]
      setSelectedValues(newArray)
      if (onSet) onSet(oldArray, newArray)
    }
  }

  const handleRemove = (index: number) => {
    const oldArray = selectedValues
    const newArray = [...oldArray.slice(0, index), ...oldArray.slice(index + 1)]

    setSelectedValues(newArray)
    if (onSet) onSet(oldArray, newArray)
  }
  return (
    <div className='relative'>
      {isLoading && (
        <div className='flex justify-center items-center py-4'>
          <Spin size='large' />
        </div>
      )}

      {errorMessage && (
        <Alert message={errorMessage} type='error' showIcon className='mb-4' />
      )}

      <Card
        title={variantName || t('productDetail.selectVariantValues')}
        size='small'
        className='mb-4'
      >
        {/* Selected Values Display */}
        <div className='mb-4'>
          <div className='text-sm text-gray-600 mb-2'>
            {t('productDetail.selectedValues')}:
          </div>

          {selectedValues?.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {selectedValues.map((value, index) => (
                <Tag
                  key={index}
                  closable
                  color='blue'
                  onClose={() => handleRemove(index)}
                  closeIcon={<CloseOutlined />}
                >
                  {value.name}
                </Tag>
              ))}
            </div>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t('productDetail.noValuesSelected')}
              className='text-sm'
            />
          )}
        </div>

        {/* Available Values List */}
        <div className='border-t pt-4'>
          <div className='text-sm text-gray-600 mb-2'>
            {t('productDetail.availableValues')}:
          </div>

          {values?.length > 0 ? (
            <div
              className='max-h-48 overflow-y-auto border rounded-md'
              style={{ maxHeight: '200px' }}
            >
              {values.map((value: VariantValueType, index: number) => {
                const isSelected = selectedValues?.some(
                  (v) => v._id === value._id
                )

                return (
                  <Button
                    key={index}
                    type={isSelected ? 'primary' : 'text'}
                    block
                    className={`text-left justify-start mb-1 ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleChoose(value)}
                    disabled={isSelected}
                  >
                    {value.name}
                    {isSelected && (
                      <span className='ml-2 text-blue-600'>✓</span>
                    )}
                  </Button>
                )
              })}
            </div>
          ) : (
            !isLoading && (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t('productDetail.noValuesAvailable')}
                className='text-sm py-4'
              />
            )
          )}
        </div>

        {/* Add New Value Section */}
        <div className='border-t pt-4 mt-4'>
          <AddVariantValueItem
            variantId={variantId}
            variantName={variantName}
            onRun={() => {
              setRefreshKey((prev) => prev + 1)
              refetch()
            }}
            isFullWidth={true}
          />
        </div>
      </Card>
    </div>
  )
}

export default MultiVariantValueSelector
