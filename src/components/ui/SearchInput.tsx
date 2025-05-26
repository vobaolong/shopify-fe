import { Input, Select } from 'antd'
import { useTranslation } from 'react-i18next'

interface SearchInputProps {
  value: string
  onChange?: (keyword: string) => void
  onSearch?: () => void
  loading?: boolean
  searchField?: string
  onFieldChange?: (field: string) => void
  fieldOptions?: { label: string; value: string }[]
}

const SearchInput = ({
  value,
  onChange,
  onSearch,
  loading = false,
  searchField,
  onFieldChange,
  fieldOptions
}: SearchInputProps) => {
  const { t } = useTranslation()
  return (
    <div className='flex gap-2'>
      {fieldOptions && (
        <Select
          value={searchField}
          onChange={onFieldChange}
          className='min-w-[150px] min-h-[40px]'
          options={fieldOptions}
          dropdownStyle={{ minWidth: 150 }}
          placeholder={t('filters.all')}
          allowClear
        />
      )}
      <Input.Search
        type='search'
        placeholder={t('search')}
        value={value}
        onChange={(e) => onChange && onChange(e.target.value)}
        onSearch={onSearch}
        enterButton={!!onSearch}
        allowClear
        loading={loading}
      />
    </div>
  )
}

export default SearchInput
