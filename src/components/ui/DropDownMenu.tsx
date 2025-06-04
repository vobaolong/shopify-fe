import { useState } from 'react'
import useToggle from '../../hooks/useToggle'
import useUpdateEffect from '../../hooks/useUpdateEffect'

interface DropDownItem {
  value: string
  label: string
  icon?: React.ReactNode
}

interface DropDownMenuProps {
  listItem?: DropDownItem[]
  value?: string
  setValue?: (value: string) => void
  size?: string
  label?: string
  borderBtn?: boolean
  resetDefault?: boolean
  required?: boolean
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  listItem = [],
  value = '',
  setValue = () => {},
  size = '',
  label = '',
  borderBtn = false,
  resetDefault = true,
  required = false
}) => {
  const [selectedItem, setSelectedItem] = useState<DropDownItem>(() =>
    resetDefault
      ? listItem.find((item) => item.value === value) || listItem[0]
      : { value: value, label: value }
  )
  const [showDropDownFlag, toggleShowDropDownFlag] = useToggle(false)
  const [iconClass, setIconClass] = useState('fa-light fa-angle-down')

  const handleSelect = (item: DropDownItem) => {
    setValue(item.value)
    toggleShowDropDownFlag()
  }

  const toggleDropDown = () => {
    toggleShowDropDownFlag()
    setIconClass(
      showDropDownFlag ? 'fa-light fa-angle-down' : 'fa-light fa-angle-up'
    )
  }

  useUpdateEffect(() => {
    const selected = resetDefault
      ? listItem.find((item) => item.value === value) || listItem[0]
      : { value: value, label: value }

    setSelectedItem(selected)
  }, [value])

  return (
    <div
      className={`cus-dropdown ${size === 'lg' && 'w-100'} ${
        label && 'cus-dropdown--has-label'
      }`}
    >
      {label && (
        <label className='cus-dropdown-label'>
          {label} {required && <span className='text-danger'>*</span>}
        </label>
      )}
      <ul
        className={`list-group cus-dropdown-menu ${
          showDropDownFlag ? 'show' : ''
        }`}
        style={{
          maxHeight: '240px',
          overflow: 'auto'
        }}
      >
        {listItem?.map((item, index) => (
          <li
            key={index}
            className='list-group-item cus-dropdown-menu-item'
            onMouseDown={() => handleSelect(item)}
          >
            {item?.icon}
            <span className={`${item?.icon && 'res-hide'} flex-nowrap`}>
              {item?.label}
            </span>
          </li>
        ))}
      </ul>

      <button
        type='button'
        className={`btn ${
          borderBtn ? 'cus-dropdown-btn--border' : 'cus-dropdown-btn'
        }
				${size === 'lg' && 'w-100'}
				${size === 'sm' && 'btn-sm'}`}
        onClick={toggleDropDown}
        onBlur={() => {
          toggleShowDropDownFlag(false)
          setIconClass('fa-light fa-angle-down')
        }}
      >
        <span
          className={`d-inline-flex justify-content-start align-items-center ${
            size === 'lg' ? 'flex-grow-1 text-start' : ''
          }`}
        >
          {selectedItem?.icon && (
            <span className='me-2'>{selectedItem.icon}</span>
          )}
          <span className={`${selectedItem?.icon && 'res-hide'} text-nowrap`}>
            {selectedItem?.label}
          </span>
        </span>
        <i className={iconClass} />
      </button>
    </div>
  )
}

export default DropDownMenu
