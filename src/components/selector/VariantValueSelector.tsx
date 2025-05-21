import { useState, useEffect } from 'react'
import ValueSelectorItem from './ValueSelectorItem'
import { VariantValueType } from '../../@types/entity.types'

interface VariantValueSelectorProps {
  listValues?: VariantValueType[]
  isEditable?: boolean
  onSet?: (values: VariantValueType[]) => void
  defaultValue?: VariantValueType[]
}

const VariantValueSelector = ({
  listValues = [],
  isEditable = true,
  onSet,
  defaultValue = []
}: VariantValueSelectorProps) => {
  const [values, setValues] = useState<VariantValueType[][]>([])
  const [selectedValues, setSelectedValues] =
    useState<VariantValueType[]>(defaultValue)

  const init = () => {
    let defaultList: VariantValueType[][] = []
    listValues.forEach((value) => {
      let flag = true
      defaultList.forEach((list) => {
        if (value.variantId._id === list[0].variantId._id) {
          list.push(value)
          flag = false
        }

        list.sort((a: VariantValueType, b: VariantValueType) => {
          const nameA = a.name.toUpperCase()
          const nameB = b.name.toUpperCase()
          if (nameA < nameB) return -1
          if (nameA > nameB) return 1
          return 0
        })
      })

      if (flag) defaultList.push([value])
    })
    setValues(defaultList)
  }

  useEffect(() => {
    init()
  }, [listValues])

  useEffect(() => {
    setSelectedValues(defaultValue)
    if (onSet && defaultValue) onSet(defaultValue)
  }, [defaultValue])

  const handleSet = (
    oldValue: VariantValueType,
    newValue: VariantValueType
  ) => {
    if (isEditable && selectedValues) {
      const newArray = [...selectedValues]
      const index = newArray.map((v) => v?._id).indexOf(oldValue?._id)
      if (index !== -1) {
        newArray.splice(index, 1)
        newArray.push(newValue)
      } else newArray.push(newValue)

      setSelectedValues(newArray)
      if (onSet) onSet(newArray)
    }
  }

  return (
    <div className='d-flex flex-column'>
      {values.map((list, index) => (
        <ValueSelectorItem
          key={index}
          listValues={list}
          defaultValue={defaultValue[index]?._id || ''}
          isEditable={isEditable}
          onSet={(oldValue, newValue) => {
            if (oldValue) handleSet(oldValue, newValue)
            else handleSet(newValue, newValue)
          }}
        />
      ))}
    </div>
  )
}

export default VariantValueSelector
