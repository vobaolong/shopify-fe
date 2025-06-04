import { useState, useEffect } from 'react'
import { listCategories, listActiveCategories } from '../../apis/category.api'
import SearchInput from '../ui/SearchInput'
import CategorySmallCard from '../card/CategorySmallCard'
import { Alert, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import { CategoryFilter, CategoryType } from '../../@types/entity.types'
import { useQuery } from '@tanstack/react-query'

interface MultiCategorySelectorProps {
  defaultValue?: CategoryType[]
  value?: CategoryType[] // Add controlled value prop
  isActive?: boolean
  isRequired?: boolean
  label?: string
  onSet?: (categories: CategoryType[]) => void
  isSelected?: boolean
}

const MultiCategorySelector: React.FC<MultiCategorySelectorProps> = ({
  defaultValue = [],
  value, // Add value prop
  isActive = false,
  isRequired = false,
  label = 'Chosen category',
  onSet = () => {},
  isSelected = true
}) => {
  const { t } = useTranslation()
  const [lv1Filter, setLv1Filter] = useState<CategoryFilter>({
    search: '',
    categoryId: null,
    sortBy: 'name',
    order: 'asc',
    limit: 100,
    page: 1
  })
  const [lv2Filter, setLv2Filter] = useState<CategoryFilter>({
    search: '',
    categoryId: '',
    sortBy: 'name',
    order: 'asc',
    limit: 100,
    page: 1
  })
  const [lv3Filter, setLv3Filter] = useState<CategoryFilter>({
    search: '',
    categoryId: '',
    sortBy: 'name',
    order: 'asc',
    limit: 100,
    page: 1
  })
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    value || defaultValue || []
  )

  // Update selectedCategories when value prop changes (controlled mode)
  useEffect(() => {
    if (value !== undefined) {
      setSelectedCategories(value)
    }
  }, [value])

  const {
    data: lv1Categories = [],
    isLoading: lv1Loading,
    error: lv1Error
  } = useQuery({
    queryKey: ['categories', 'lv1', lv1Filter, isActive],
    queryFn: async () => {
      if (isActive) {
        return (await listActiveCategories(lv1Filter)).categories
      } else {
        return (await listCategories(lv1Filter)).categories
      }
    }
  })

  const {
    data: lv2Categories = [],
    isLoading: lv2Loading,
    error: lv2Error
  } = useQuery({
    queryKey: ['categories', 'lv2', lv2Filter, isActive],
    queryFn: async () => {
      if (!lv2Filter.categoryId) return []
      if (isActive) {
        return (await listActiveCategories(lv2Filter)).categories
      } else {
        return (await listCategories(lv2Filter)).categories
      }
    },
    enabled: !!lv2Filter.categoryId
  })

  const {
    data: lv3Categories = [],
    isLoading: lv3Loading,
    error: lv3Error
  } = useQuery({
    queryKey: ['categories', 'lv3', lv3Filter, isActive],
    queryFn: async () => {
      if (!lv3Filter.categoryId) return []
      if (isActive) {
        return (await listActiveCategories(lv3Filter)).categories
      } else {
        return (await listCategories(lv3Filter)).categories
      }
    },
    enabled: !!lv3Filter.categoryId
  })

  // Initialize selectedCategories based on mode
  useEffect(() => {
    if (value === undefined && defaultValue) {
      setSelectedCategories(defaultValue)
    }
  }, [defaultValue, value])

  const handleChangeKeyword = (keyword: string) => {
    setLv1Filter({
      ...lv1Filter,
      search: keyword
    })

    setLv2Filter({
      ...lv2Filter,
      categoryId: ''
    })

    setLv3Filter({
      ...lv3Filter,
      categoryId: ''
    })
  }
  const handleClick = (
    filter: CategoryFilter | null,
    setFilter: React.Dispatch<React.SetStateAction<CategoryFilter>> | null,
    category: CategoryType
  ) => {
    if (setFilter && filter)
      setFilter({
        ...filter,
        categoryId: category._id
      })

    if (filter === lv2Filter)
      setLv3Filter({
        ...lv3Filter,
        categoryId: ''
      })

    if (isSelected && filter === null) {
      const temp = selectedCategories.map((cat) => cat._id)
      if (temp.indexOf(category._id) === -1) {
        const newSelected = [...selectedCategories, category]
        // Update state only if not in controlled mode
        if (value === undefined) {
          setSelectedCategories(newSelected)
        }
        if (onSet) onSet(newSelected)
      }
    }
  }
  const handleRemove = (index: number) => {
    const newArray = [...selectedCategories]
    newArray.splice(index, 1)
    // Update state only if not in controlled mode
    if (value === undefined) {
      setSelectedCategories(newArray)
    }
    if (onSet) onSet(newArray)
  }

  return (
    <div className='row'>
      <div className='col'>
        <SearchInput value={lv1Filter.search} onChange={handleChangeKeyword} />
      </div>{' '}
      <div className='col-12 position-relative'>
        {(lv1Loading || lv2Loading || lv3Loading) && <Spin />}
        {(lv1Error || lv2Error || lv3Error) && (
          <Alert
            message={String(lv1Error || lv2Error || lv3Error)}
            type='error'
            showIcon
          />
        )}

        <div className='d-flex border p-1 mt-2 rounded-2 bg-value'>
          <div
            className='list-group m-1'
            style={{
              width: '33.33333%',
              overflowY: 'auto',
              height: '250px'
            }}
          >
            {' '}
            {lv1Categories?.map((category: CategoryType, index: number) => (
              <div key={category._id || index}>
                <button
                  type='button'
                  className={`list-group-item ripple list-group-item-action d-flex justify-content-between align-items-center ${
                    category._id === lv2Filter.categoryId && 'active'
                  }`}
                  onClick={() => handleClick(lv2Filter, setLv2Filter, category)}
                >
                  <span className='res-smaller-md'>{category.name}</span>
                  <i className='fa-solid fa-angle-right res-smaller-lg res-hide' />
                </button>
              </div>
            ))}
          </div>

          <div
            className='list-group m-1'
            style={{
              width: '33.33333%',
              overflowY: 'auto',
              height: '250px'
            }}
          >
            {' '}
            {lv2Categories?.map((category: CategoryType, index: number) => (
              <div key={category._id || index}>
                <button
                  type='button'
                  className={`list-group-item ripple list-group-item-action d-flex justify-content-between align-items-center  ${
                    category._id === lv3Filter.categoryId && 'active'
                  }`}
                  onClick={() => handleClick(lv3Filter, setLv3Filter, category)}
                >
                  <span className='res-smaller-md'>{category.name}</span>
                  <i className='fa-solid fa-angle-right res-smaller-lg res-hide' />
                </button>
              </div>
            ))}
          </div>

          <div
            className='list-group m-1'
            style={{
              width: '33.33333%',
              overflowY: 'auto',
              height: '250px'
            }}
          >
            {' '}
            {lv3Categories?.map((category: CategoryType, index: number) => (
              <div key={category._id || index}>
                <button
                  type='button'
                  className={`list-group-item ripple list-group-item-action ${
                    selectedCategories &&
                    Array.isArray(selectedCategories) &&
                    selectedCategories
                      .map((cat) => cat._id)
                      .indexOf(category._id) !== -1 &&
                    'active'
                  }`}
                  onClick={() => handleClick(null, null, category)}
                >
                  <span className='res-smaller-md'>{category.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {isSelected && (
        <div className='col mt-2'>
          <div className='mt-4 position-relative'>
            <label
              className='position-absolute text-muted'
              style={{
                fontSize: '0.8rem',
                left: '12px',
                top: '-18px'
              }}
            >
              {label}
            </label>

            <div
              style={{ height: '100%', maxHeight: '300px', overflow: 'auto' }}
              className='form-control border bg-light-subtle d-flex flex-column gap-3'
            >
              {selectedCategories &&
                (Array.isArray(selectedCategories) ? (
                  selectedCategories.map(
                    (category: CategoryType, index: number) => (
                      <span
                        key={index}
                        className='d-flex align-items-center position-relative'
                      >
                        <CategorySmallCard category={category} />
                        <button
                          style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            right: '0'
                          }}
                          type='button'
                          className='btn btn-outline-danger btn-sm ripple ms-2 position-absolute'
                          onClick={() => handleRemove(index)}
                        >
                          <i className='fa-solid fa-xmark' />
                        </button>
                      </span>
                    )
                  )
                ) : (
                  <span className={isRequired ? 'text-danger' : undefined}>
                    {t('variantDetail.required')}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MultiCategorySelector
