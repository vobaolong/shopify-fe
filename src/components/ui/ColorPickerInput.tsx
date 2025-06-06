import React from 'react'
import { ColorPicker } from 'antd'
import type { ColorPickerProps } from 'antd'
import { useTranslation } from 'react-i18next'

interface ColorPickerInputProps {
  color: string
  onChange: (color: string) => void
  label?: string
  required?: boolean
}

const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  color,
  onChange,
  label,
  required = true
}) => {
  const { t } = useTranslation()
  const handleChange: ColorPickerProps['onChange'] = (color) => {
    onChange(color.toHexString())
  }

  return (
    <div className='mt-3'>
      <small className='text-secondary ms-1'>
        {label} {required && <small className='text-danger'>*</small>}
      </small>
      <div className='flex items-center ms-2'>
        <span className='me-2'>{t('pickColor')} </span>
        <ColorPicker value={color} onChange={handleChange} />
      </div>
    </div>
  )
}

export default ColorPickerInput
