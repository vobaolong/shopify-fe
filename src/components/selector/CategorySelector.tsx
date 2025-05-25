/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listCategories, listActiveCategories } from '../../apis/category'
import { CategoryType } from '../../@types/entity.types'
import {
  Input,
  List,
  Button,
  Spin,
  Alert,
  Row,
  Col,
  Card,
  Typography
} from 'antd'
import CategorySmallCard from '../card/CategorySmallCard'
import { useTranslation } from 'react-i18next'

interface CategorySelectorProps {
  defaultValue?: CategoryType | ''
  isActive?: boolean
  selected?: 'child' | 'parent'
  label?: string
  onSet?: (category: CategoryType | '') => void
  isSelected?: boolean
  isRequired?: boolean
}

type CategoryFilter = {
  search: string
  categoryId: string | null
  sortBy: string
  order: string
  limit: number
  page: number
}

const defaultLv1Filter: CategoryFilter = {
  search: '',
  categoryId: null,
  sortBy: 'name',
  order: 'asc',
  limit: 100,
  page: 1
}
const defaultLv2Filter: CategoryFilter = {
  search: '',
  categoryId: null,
  sortBy: 'name',
  order: 'asc',
  limit: 100,
  page: 1
}
const defaultLv3Filter: CategoryFilter = {
  search: '',
  categoryId: null,
  sortBy: 'name',
  order: 'asc',
  limit: 100,
  page: 1
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  defaultValue = '',
  isActive = false,
  selected = 'child',
  label = 'Chosen category',
  onSet = () => {},
  isSelected = true,
  isRequired = false
}) => {
  const { t } = useTranslation()
  const [lv1Filter, setLv1Filter] = useState<CategoryFilter>(defaultLv1Filter)
  const [lv2Filter, setLv2Filter] = useState<CategoryFilter>(defaultLv2Filter)
  const [lv3Filter, setLv3Filter] = useState<CategoryFilter>(defaultLv3Filter)
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | ''>(
    defaultValue
  )
  const [search, setSearch] = useState('')

  const {
    data: lv1Data,
    isLoading: lv1Loading,
    error: lv1Error
  } = useQuery<CategoryType[]>({
    queryKey: ['categories', 'lv1', lv1Filter, isActive],
    queryFn: async () => {
      if (isActive) {
        const res = await listActiveCategories(lv1Filter)
        return res.categories || []
      } else {
        const res = await listCategories(lv1Filter)
        return res.categories || []
      }
    }
  })

  const {
    data: lv2Data,
    isLoading: lv2Loading,
    error: lv2Error
  } = useQuery<CategoryType[]>({
    queryKey: ['categories', 'lv2', lv2Filter, isActive],
    queryFn: async () => {
      if (!lv2Filter.categoryId) return []
      if (isActive) {
        const res = await listActiveCategories(lv2Filter)
        return res.categories || []
      } else {
        const res = await listCategories(lv2Filter)
        return res.categories || []
      }
    },
    enabled: !!lv2Filter.categoryId
  })

  const {
    data: lv3Data,
    isLoading: lv3Loading,
    error: lv3Error
  } = useQuery<CategoryType[]>({
    queryKey: ['categories', 'lv3', lv3Filter, isActive],
    queryFn: async () => {
      if (!lv3Filter.categoryId) return []
      if (isActive) {
        const res = await listActiveCategories(lv3Filter)
        return res.categories || []
      } else {
        const res = await listCategories(lv3Filter)
        return res.categories || []
      }
    },
    enabled: !!lv3Filter.categoryId
  })

  useEffect(() => {
    setSelectedCategory(defaultValue)
  }, [defaultValue])

  // Tìm kiếm lv1
  const handleChangeKeyword = (keyword: string) => {
    setSearch(keyword)
    setLv1Filter({
      ...lv1Filter,
      search: keyword
    })
    setLv2Filter({ ...defaultLv2Filter })
    setLv3Filter({ ...defaultLv3Filter })
  }

  // Chọn category cấp 1 hoặc 2
  const handleClick = (
    filter: CategoryFilter | null,
    setFilter: React.Dispatch<React.SetStateAction<CategoryFilter>> | null,
    category: CategoryType
  ) => {
    if (setFilter && filter) {
      setFilter({
        ...filter,
        categoryId: category._id
      })
    }
    if (filter === lv2Filter) {
      setLv3Filter({ ...defaultLv3Filter })
    }
    if (isSelected) {
      if (
        (selected === 'parent' && filter === lv2Filter) ||
        (selected === 'parent' && filter === lv3Filter) ||
        (selected === 'child' && filter === null)
      ) {
        setSelectedCategory(category)
        onSet && onSet(category)
      }
    }
  }

  // Chọn category cấp 3
  const handleClickLv3 = (category: CategoryType) => {
    setSelectedCategory(category)
    onSet && onSet(category)
  }

  // Xóa chọn
  const handleDelete = () => {
    setSelectedCategory('')
    onSet && onSet('')
  }

  return (
    <Row gutter={16}>
      <Input.Search
        value={search}
        onChange={(e) => handleChangeKeyword(e.target.value)}
        placeholder={t('search')}
        allowClear
        className='px-2 pb-4'
      />
      <Col span={8}>
        {lv1Loading ? (
          <Spin />
        ) : lv1Error ? (
          <Alert type='error' message={String(lv1Error as any)} />
        ) : (
          <List
            dataSource={lv1Data || []}
            renderItem={(category) => (
              <List.Item>
                <Button
                  type={
                    category._id === lv2Filter.categoryId
                      ? 'primary'
                      : 'default'
                  }
                  block
                  onClick={() => handleClick(lv2Filter, setLv2Filter, category)}
                  style={{ textAlign: 'left' }}
                >
                  {category.name}
                </Button>
              </List.Item>
            )}
            style={{ maxHeight: 250, overflowY: 'auto', background: '#fff' }}
          />
        )}
      </Col>
      <Col span={8}>
        {lv2Loading ? (
          <Spin />
        ) : lv2Error ? (
          <Alert type='error' message={String(lv2Error as any)} />
        ) : (
          <List
            dataSource={lv2Data || []}
            renderItem={(category) => (
              <List.Item>
                <Button
                  type={
                    category._id === lv3Filter.categoryId
                      ? 'primary'
                      : 'default'
                  }
                  block
                  onClick={() => handleClick(lv3Filter, setLv3Filter, category)}
                  style={{ textAlign: 'left' }}
                >
                  {category.name}
                </Button>
              </List.Item>
            )}
            style={{ maxHeight: 250, overflowY: 'auto', background: '#fff' }}
          />
        )}
      </Col>
      <Col span={8}>
        {lv3Loading ? (
          <Spin />
        ) : lv3Error ? (
          <Alert type='error' message={String(lv3Error as any)} />
        ) : (
          <List
            dataSource={lv3Data || []}
            renderItem={(category) => (
              <List.Item>
                <Button
                  type={
                    selectedCategory &&
                    typeof selectedCategory !== 'string' &&
                    category._id === selectedCategory._id
                      ? 'primary'
                      : 'default'
                  }
                  block
                  onClick={() => handleClickLv3(category)}
                  style={{ textAlign: 'left' }}
                >
                  {category.name}
                </Button>
              </List.Item>
            )}
            style={{ maxHeight: 250, overflowY: 'auto', background: '#fff' }}
          />
        )}
      </Col>
      {isSelected && (
        <Col span={24} style={{ marginTop: 16 }}>
          <Typography.Text type='secondary' style={{ fontSize: 12 }}>
            {label}
          </Typography.Text>
          <Card style={{ minHeight: 60, marginTop: 8, background: '#fafafa' }}>
            {selectedCategory && typeof selectedCategory !== 'string' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CategorySmallCard category={selectedCategory} />
                <Button
                  type='text'
                  danger
                  size='small'
                  onClick={handleDelete}
                  style={{ marginLeft: 'auto' }}
                >
                  {t('delete') || <span>X</span>}
                </Button>
              </div>
            ) : (
              <span className={isRequired ? 'text-danger' : ''}>
                {t('variantDetail.required')}
              </span>
            )}
          </Card>
        </Col>
      )}
    </Row>
  )
}

export default CategorySelector
