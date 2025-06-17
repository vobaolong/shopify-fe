import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Input, Select } from 'antd'
import {
  SearchOutlined,
  ShopOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { useTranslation } from 'react-i18next'

const { Search } = Input

const SearchBar = () => {
  const { t } = useTranslation()
  const listOptions = [
    {
      value: 'products',
      label: t('product'),
      icon: <AppstoreOutlined />
    },
    {
      value: 'stores',
      label: t('store'),
      icon: <ShopOutlined />
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

  const handleSearch = (value: string) => {
    navigate(`/${option}/search?keyword=${value}`)
  }

  return (
    <div className='flex items-center gap-2 max-w-xl w-full'>
      <Select
        value={option}
        onChange={setOption}
        className='w-32'
        options={listOptions.map((item) => ({
          value: item.value,
          label: (
            <div className='flex items-center gap-1'>
              {item.icon}
              <span className='hidden sm:inline'>{item.label}</span>
            </div>
          )
        }))}
      />
      <Search
        placeholder={t('searchHolder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
        enterButton={<SearchOutlined />}
        className='!w-full !flex-1 border rounded-md'
      />
    </div>
  )
}

export default SearchBar
