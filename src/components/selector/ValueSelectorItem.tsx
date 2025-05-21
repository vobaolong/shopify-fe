import { useState, useEffect } from 'react'
import { VariantValueType } from '../../@types/entity.types'

interface ValueSelectorItemProps {
  listValues: VariantValueType[]
  isEditable?: boolean
  onSet?: (
    oldValue: VariantValueType | undefined,
    newValue: VariantValueType
  ) => void
  defaultValue?: string
}

const ValueSelectorItem: React.FC<ValueSelectorItemProps> = ({
  listValues = [],
  isEditable = true,
  onSet,
  defaultValue = ''
}) => {
  const [values, setValues] = useState<VariantValueType[]>(listValues)
  const [selectedValue, setSelectedValue] = useState<
    VariantValueType | undefined
  >(listValues.find((v) => v._id === defaultValue))

  useEffect(() => {
    setValues(listValues)
    const oldValue = selectedValue
    const newValue = listValues[0]
    setSelectedValue(newValue)
    if (onSet) onSet(oldValue, newValue)
  }, [listValues])

  useEffect(() => {
    if (defaultValue) {
      const found = listValues.find((value) => value._id === defaultValue)
      setSelectedValue(found)
    }
  }, [defaultValue, listValues])

  const handleChoose = (value: VariantValueType) => {
    const oldValue = selectedValue
    const newValue = value
    setSelectedValue(newValue)
    if (onSet) onSet(oldValue, newValue)
  }

  return (
    <div className='position-relative my-1 d-grid align-items-start'>
      <span
        style={{ fontSize: '.875rem' }}
        className='label-variant text-secondary me-2'
      >
        {values[0]?.variantId.name}
      </span>
      <div className='button-container'>
        {values.map((value, index) => (
          <button
            key={index}
            type='button'
            className={`btn btn-sm ${isEditable && 'ripple'} ${
              selectedValue?._id === value._id
                ? 'btn-primary'
                : 'btn-outline-primary'
            } cus-btn-style`}
            disabled={!isEditable}
            onClick={() => handleChoose(value)}
          >
            <span>{value.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ValueSelectorItem
