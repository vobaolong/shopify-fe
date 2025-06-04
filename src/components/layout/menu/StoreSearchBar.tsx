import { Button } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'

interface StoreSearchBarProps {
  storeId?: string
}

const StoreSearchBar = ({ storeId = '' }: StoreSearchBarProps) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const [query, setQuery] = useState(
    () => new URLSearchParams(location.search).get('keyword') || ''
  )

  const handleChange = (e: any) => {
    setQuery(e.target.value)
  }

  const handleFormSubmit = (e: any) => {
    e.preventDefault()
    navigate(`/store/collection/${storeId}?keyword=${query}`)
  }

  return (
    <form
      className='store-search-bar m-0 input-group'
      onSubmit={handleFormSubmit}
    >
      <input
        className='form-control rounded-1'
        type='search'
        placeholder={t('search')}
        aria-label='Search'
        value={query}
        onChange={handleChange}
      />
      <Button
        className='btn btn-outline-light border border-primary cus-outline text-white ripple rounded-end-1'
        type='dashed'
        onClick={handleFormSubmit}
      >
        <i className='fa-solid fa-search' />
      </Button>
    </form>
  )
}

export default StoreSearchBar
