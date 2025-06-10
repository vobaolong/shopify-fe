import { useEffect, useState } from 'react'
import { listCategories, listActiveCategories } from '../../apis/category.api'
import { Alert, Spin, Select, Row, Col } from 'antd'
import { useTranslation } from 'react-i18next'
import { CategoryType } from '../../@types/entity.types'
import { useQuery } from '@tanstack/react-query'

interface MultiCategorySelectorProps {
  value?: {
    lv1?: string
    lv2?: string
    lv3?: string
    categoryObj?: CategoryType
  }[]
  isActive?: boolean
  isRequired?: boolean
  label?: string
  onSet?: (
    value: {
      lv1?: string
      lv2?: string
      lv3?: string
      categoryObj?: CategoryType
    }[]
  ) => void
}

const MultiCategorySelector: React.FC<MultiCategorySelectorProps> = ({
  value = [],
  isActive = false,
  onSet = () => {}
}) => {
  const { t } = useTranslation()
  const [lv1, setLv1] = useState<string | undefined>(undefined)
  const [lv2, setLv2] = useState<string | undefined>(undefined)
  const [lv3Temp, setLv3Temp] = useState<string[]>([])

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
    setLv2(undefined)
    setLv3Temp([])
  }, [lv1])

  useEffect(() => {
    setLv3Temp([])
  }, [lv2])

  const handleLv3Change = (selectedLv3: string[]) => {
    const currentLv3 = value.map((v) => v.lv3)
    const newLv3 = selectedLv3.filter((id) => !currentLv3.includes(id))
    if (newLv3.length === 0) {
      setLv3Temp([])
      return
    }
    const newObjs = newLv3.map((lv3id) => {
      const catObj = lv3Categories.find(
        (cat: CategoryType) => cat._id === lv3id
      )
      return { lv1, lv2, lv3: lv3id, categoryObj: catObj }
    })
    onSet([...value, ...newObjs])
    setLv3Temp([])
  }

  const handleTagRemove = (lv3id: string) => {
    const newValue = value.filter((v) => v.lv3 !== lv3id)
    onSet(newValue)
  }

  // Lấy selected lv3 từ value prop
  const selectedLv3 = Array.isArray(value)
    ? value.map((v) => v.lv3!).filter(Boolean)
    : []

  return (
    <div>
      <div className='scroll-tags'>
        <Select
          mode='multiple'
          style={{ width: '100%', marginBottom: 8 }}
          value={selectedLv3}
          onChange={(ids) => {
            const removed = selectedLv3.filter((id) => !ids.includes(id))
            if (removed.length > 0) {
              removed.forEach(handleTagRemove)
            }
          }}
          options={value.map((v) => ({
            label: v.categoryObj?.name || v.lv3,
            value: v.lv3
          }))}
          placeholder={t('Các phân loại đã chọn')}
          open={false}
          allowClear
        />
      </div>
      <Row gutter={16}>
        <Col span={8}>
          <span>{t('categoryForm.lv1')}</span>
          <Select
            style={{ width: '100%' }}
            placeholder={t('Chọn cấp 1')}
            value={lv1}
            onChange={setLv1}
            loading={lv1Loading}
            options={lv1Categories.map((cat: CategoryType) => ({
              label: cat.name,
              value: cat._id,
              children: cat.name
            }))}
            showSearch
            allowClear
            virtual={false}
            styles={{ popup: { root: { maxHeight: 300, overflow: 'auto' } } }}
            filterOption={(input, option) =>
              (option?.children?.toString() ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>
        <Col span={8}>
          <span>{t('categoryForm.lv2')}</span>
          <Select
            style={{ width: '100%' }}
            placeholder={t('Chọn cấp 2')}
            value={lv2}
            onChange={setLv2}
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
            styles={{ popup: { root: { maxHeight: 300, overflow: 'auto' } } }}
            filterOption={(input, option) =>
              (option?.children?.toString() ?? '')
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Col>
        <Col span={8}>
          <span>{t('categoryForm.lv3')}</span>
          <Select
            mode='multiple'
            style={{ width: '100%' }}
            placeholder={t('Chọn cấp 3')}
            value={lv3Temp}
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
            styles={{ popup: { root: { maxHeight: 300, overflow: 'auto' } } }}
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
    </div>
  )
}

export default MultiCategorySelector
