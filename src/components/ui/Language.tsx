import { useEffect, useState } from 'react'
import { Button, Dropdown, Space } from 'antd'
import { DownOutlined, GlobalOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import vietnam from '../../assets/vietnam-flag-icon.svg'
import english from '../../assets/united-kingdom-flag-icon.svg'
import { locales } from '../../i18n/i18n'
import { useTranslation } from 'react-i18next'

interface LanguageProps {
  vertical?: boolean
}

const Language: React.FC<LanguageProps> = ({ vertical = true }) => {
  const { i18n } = useTranslation()
  const [activeLang, setActiveLang] = useState(i18n.language)

  const currentLanguage =
    locales[i18n.language as keyof typeof locales] || locales.en

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('language', lang)
    setActiveLang(lang)
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage) {
      changeLanguage(savedLanguage)
    }
  }, [i18n.language])

  const menuItems: MenuProps['items'] = [
    {
      key: 'vi',
      label: (
        <Space>
          <img src={vietnam} alt='Vietnamese flag' className='w-6' />
          Tiếng Việt
        </Space>
      ),
      onClick: () => changeLanguage('vi')
    },
    {
      key: 'en',
      label: (
        <Space>
          <img src={english} alt='English flag' className='w-6' />
          English
        </Space>
      ),
      onClick: () => changeLanguage('en')
    }
  ]

  if (vertical) {
    return (
      <Dropdown
        menu={{ items: menuItems }}
        placement='bottomLeft'
        trigger={['click']}
      >
        <Button
          type='text'
          className='text-white hover:bg-white hover:text-blue-600 flex items-center p-2'
        >
          <Space>
            <img
              src={currentLanguage === 'English' ? english : vietnam}
              alt='Current language flag'
              className='w-6'
            />
            <DownOutlined style={{ fontSize: '10px' }} />
          </Space>
        </Button>
      </Dropdown>
    )
  }

  return (
    <div className='flex gap-2'>
      <Button
        type={activeLang === 'en' ? 'primary' : 'default'}
        onClick={() => changeLanguage('en')}
        className='flex items-center gap-1'
      >
        <img src={english} alt='English flag' className='w-4 h-3' />
        <span className='hidden sm:inline'>English</span>
      </Button>
      <Button
        type={activeLang === 'vi' ? 'primary' : 'default'}
        onClick={() => changeLanguage('vi')}
        className='flex items-center gap-1'
      >
        <img src={vietnam} alt='Vietnamese flag' className='w-4 h-3' />
        <span className='hidden sm:inline'>Tiếng Việt</span>
      </Button>
    </div>
  )
}

export default Language
