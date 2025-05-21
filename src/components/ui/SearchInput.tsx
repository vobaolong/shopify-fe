import { Input } from 'antd'
import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'

interface SearchInputProps {
  onChange?: (keyword: string) => void
}

const SearchInput: React.FC<SearchInputProps> = ({ onChange }) => {
  const [keyword, setKeyword] = useState('')
  const { t } = useTranslation()
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleChangeKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeyword(value)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    typingTimeoutRef.current = setTimeout(() => {
      onChange && onChange(value)
    }, 600)
  }

  return (
    <Input
      className='form-control rounded-md max-w-[300px]'
      type='search'
      placeholder={t('search')}
      value={keyword}
      onChange={handleChangeKeyword}
    />
  )
}

export default SearchInput
