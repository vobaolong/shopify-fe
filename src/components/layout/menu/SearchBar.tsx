import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import DropDownMenu from '../../ui/DropDownMenu'
import { useTranslation } from 'react-i18next'

const SearchBar = () => {
  const { t } = useTranslation()
  const listOptions = [
    {
      value: 'products',
      label: t('product'),
      icon: <i className='fa-light fa-box' />
    },
    {
      value: 'stores',
      label: t('store'),
      icon: <i className='fa-light fa-store' />
    }
  ]
  const location = useLocation()
  const navigate = useNavigate()
  const currentOption = location.pathname.split('/')[1]
  const [query, setQuery] = useState(() => {
    if (currentOption === 'products' || currentOption === 'stores')
      return new URLSearchParams(location.search).get('keyword') || ''
    else return ''
  })
  const [option, setOption] = useState(() => {
    if (currentOption === 'products' || currentOption === 'stores')
      return currentOption
    else return 'products'
  })

  const handleChange = (e: any) => {
    setQuery(e.target.value)
  }

  const handleFormSubmit = (e: any) => {
    e.preventDefault()
    navigate(`/${option}/search?keyword=${query}`)
  }

  return (
    <form
      className='search-bar m-0 input-group border rounded-2'
      onSubmit={handleFormSubmit}
    >
      <input
        className='form-control rounded-start-1 border-end ms-1'
        type='search'
        placeholder={t('searchHolder')}
        value={query}
        onChange={handleChange}
      />

      <DropDownMenu
        listItem={listOptions}
        value={option}
        setValue={setOption}
      />

      <button
        className='btn cus-outline inherit ripple rounded-end-1'
        type='submit'
        onClick={handleFormSubmit}
      >
        <i className='fa-light fa-search' />
      </button>
    </form>
  )
}

export default SearchBar
