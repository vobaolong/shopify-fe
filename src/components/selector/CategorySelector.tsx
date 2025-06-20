import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listCategories, listActiveCategories } from '../../apis/category.api'
import { CategoryType } from '../../@types/entity.types'
import { Select, Alert, Row, Col, Typography, Button } from 'antd'
import CategorySmallCard from '../card/CategorySmallCard'
import { useTranslation } from 'react-i18next'
import { CloseOutlined } from '@ant-design/icons'

interface CategorySelectorProps {
  value?: CategoryType | undefined
  isActive?: boolean
  label?: string
  onChange?: (category: CategoryType | undefined) => void
  isRequired?: boolean
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value = undefined,
  isActive = false,
  label = 'Chosen category',
  onChange = () => {},
  isRequired = false
}) => {
  const { t } = useTranslation()
  const isSettingFromProp = useRef(false)
  const [lv1, setLv1] = useState<string | undefined>(undefined)
  const [lv2, setLv2] = useState<string | undefined>(undefined)
  const [lv3, setLv3] = useState<string | undefined>(undefined)
  const [selectedObj, setSelectedObj] = useState<CategoryType | undefined>(
    typeof value === 'object' && value ? value : undefined
  )
  useEffect(() => {
    isSettingFromProp.current = true
    if (typeof value === 'object' && value) {
      let lv1Id: string | undefined = undefined
      let lv2Id: string | undefined = undefined
      let lv3Id: string | undefined = undefined

      if (value.categoryId === null) {
        lv1Id = value._id
      } else if (value.categoryId && typeof value.categoryId === 'object') {
        if (value.categoryId.categoryId === null) {
          lv1Id = value.categoryId._id
          lv2Id = value._id
        } else if (
          value.categoryId.categoryId &&
          typeof value.categoryId.categoryId === 'object'
        ) {
          lv1Id = value.categoryId.categoryId._id
          lv2Id = value.categoryId._id
          lv3Id = value._id
        }
      }
      setLv1(lv1Id)
      setLv2(lv2Id)
      setLv3(lv3Id)
      setSelectedObj(value)
    } else if (value === undefined || value === null) {
      setLv1(undefined)
      setLv2(undefined)
      setLv3(undefined)
      setSelectedObj(undefined)
    }
    setTimeout(() => {
      isSettingFromProp.current = false
    }, 0)
  }, [value])

  const {
    data: lv1Categories = [],
    isLoading: lv1Loading,
    error: lv1Error
  } = useQuery({
    queryKey: ['categories', 'lv1', isActive],
    queryFn: async () => {
      if (isActive) {
        return (
          await listActiveCategories({ limit: 1000, page: 1, categoryId: null })
        ).categories
      } else {
        return (
          await listCategories({ limit: 1000, page: 1, categoryId: null })
        ).categories
      }
    }
  })

  const {
    data: lv2Categories = [],
    isLoading: lv2Loading,
    error: lv2Error
  } = useQuery({
    queryKey: ['categories', 'lv2', lv1, isActive],
    queryFn: async () => {
      if (!lv1) return []
      if (isActive) {
        return (
          await listActiveCategories({ limit: 1000, page: 1, categoryId: lv1 })
        ).categories
      } else {
        return (await listCategories({ limit: 1000, page: 1, categoryId: lv1 }))
          .categories
      }
    },
    enabled: !!lv1
  })

  const {
    data: lv3Categories = [],
    isLoading: lv3Loading,
    error: lv3Error
  } = useQuery({
    queryKey: ['categories', 'lv3', lv2, isActive],
    queryFn: async () => {
      if (!lv2) return []
      if (isActive) {
        return (
          await listActiveCategories({ limit: 1000, page: 1, categoryId: lv2 })
        ).categories
      } else {
        return (await listCategories({ limit: 1000, page: 1, categoryId: lv2 }))
          .categories
      }
    },
    enabled: !!lv2
  })

  useEffect(() => {
    if (!isSettingFromProp.current) {
      setLv2(undefined)
      setLv3(undefined)
    }
  }, [lv1])

  useEffect(() => {
    if (!isSettingFromProp.current) {
      setLv3(undefined)
    }
  }, [lv2])

  const handleLv1Change = (id: string | undefined) => {
    setLv1(id)
    if (id) {
      const catObj = lv1Categories.find((cat: CategoryType) => cat._id === id)
      setSelectedObj(catObj)
      onChange && onChange(catObj || undefined)
    } else {
      setSelectedObj(undefined)
      onChange && onChange(undefined)
    }
  }

  const handleLv2Change = (id: string | undefined) => {
    setLv2(id)
    if (id) {
      const catObj = lv2Categories.find((cat: CategoryType) => cat._id === id)
      setSelectedObj(catObj)
      onChange && onChange(catObj || undefined)
    } else {
      if (lv1) {
        const catObj = lv1Categories.find(
          (cat: CategoryType) => cat._id === lv1
        )
        setSelectedObj(catObj)
        onChange && onChange(catObj || undefined)
      } else {
        setSelectedObj(undefined)
        onChange && onChange(undefined)
      }
    }
  }

  const handleLv3Change = (id: string | undefined) => {
    setLv3(id)
    if (id) {
      const catObj = lv3Categories.find((cat: CategoryType) => cat._id === id)
      setSelectedObj(catObj)
      onChange && onChange(catObj || undefined)
    } else {
      if (lv2) {
        const catObj = lv2Categories.find(
          (cat: CategoryType) => cat._id === lv2
        )
        setSelectedObj(catObj)
        onChange && onChange(catObj || undefined)
      } else if (lv1) {
        const catObj = lv1Categories.find(
          (cat: CategoryType) => cat._id === lv1
        )
        setSelectedObj(catObj)
        onChange && onChange(catObj || undefined)
      } else {
        setSelectedObj(undefined)
        onChange && onChange(undefined)
      }
    }
  }

  const handleDelete = () => {
    setLv1(undefined)
    setLv2(undefined)
    setLv3(undefined)
    setSelectedObj(undefined)
    onChange && onChange(undefined)
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <span>{t('categoryForm.lv1')}</span>{' '}
          <Select
            style={{ width: '100%' }}
            placeholder={t('Chọn cấp 1')}
            value={lv1}
            onChange={handleLv1Change}
            loading={lv1Loading}
            options={lv1Categories.map((cat: CategoryType) => ({
              label: cat.name,
              value: cat._id,
              children: cat.name
            }))}
            showSearch
            allowClear
            virtual={false}
            filterOption={(input, option) =>
              (option?.children?.toString() ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>
        <Col span={8}>
          <span>{t('categoryForm.lv2')}</span>{' '}
          <Select
            style={{ width: '100%' }}
            placeholder={t('Chọn cấp 2')}
            value={lv2}
            onChange={handleLv2Change}
            loading={lv2Loading}
            options={lv2Categories.map((cat: CategoryType) => ({
              label: cat.name,
              value: cat._id,
              children: cat.name
            }))}
            showSearch
            allowClear
            disabled={!lv1}
            virtual={false}
            filterOption={(input, option) =>
              (option?.children?.toString() ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>
        <Col span={8}>
          <span>{t('categoryForm.lv3')}</span>{' '}
          <Select
            style={{ width: '100%' }}
            placeholder={t('Chọn cấp 3')}
            value={lv3}
            onChange={handleLv3Change}
            loading={lv3Loading}
            options={lv3Categories.map((cat: CategoryType) => ({
              label: cat.name,
              value: cat._id,
              children: cat.name
            }))}
            showSearch
            allowClear
            disabled={!lv2}
            virtual={false}
            filterOption={(input, option) =>
              (option?.children?.toString() ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>
      </Row>
      {(lv1Error || lv2Error || lv3Error) && (
        <Alert
          message={String(lv1Error || lv2Error || lv3Error)}
          type='error'
          showIcon
        />
      )}
      <div style={{ marginTop: 16 }}>
        <Typography.Text type='secondary' style={{ fontSize: 12 }}>
          {label}
        </Typography.Text>
        <div className='mt-2 bg-gray-100 p-2 rounded-md'>
          {selectedObj ? (
            <div className='flex items-center gap-2'>
              <CategorySmallCard category={selectedObj} />
              <Button
                type='text'
                danger
                onClick={handleDelete}
                className='!ml-auto'
              >
                <CloseOutlined />
              </Button>
            </div>
          ) : (
            <span className={isRequired ? 'text-danger' : ''}>
              {isRequired ? t('variantDetail.required') : t('Chưa chọn')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategorySelector
