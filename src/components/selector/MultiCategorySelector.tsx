import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth'
import { listCategories, listActiveCategories } from '../../apis/category'
import SearchInput from '../ui/SearchInput'
import CategorySmallCard from '../card/CategorySmallCard'
import Error from '../ui/Error'
import Loading from '../ui/Loading'
import { useTranslation } from 'react-i18next'
import { CategoryType } from '../../@types/entity.types'

interface CategoryFilter {
  search: string
  categoryId: string | null
  sortBy: string
  order: string
  limit: number
  page: number
}

interface MultiCategorySelectorProps {
  defaultValue?: CategoryType[]
  isActive?: boolean
  isRequired?: boolean
  label?: string
  onSet?: (categories: CategoryType[] | '') => void
  isSelected?: boolean
}

const MultiCategorySelector: React.FC<MultiCategorySelectorProps> = ({
  defaultValue = [],
  isActive = false,
  isRequired = false,
  label = 'Chosen category',
  onSet = () => {},
  isSelected = true
}) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [lv1Categories, setLv1Categories] = useState<CategoryType[]>([])
  const [lv2Categories, setLv2Categories] = useState<CategoryType[]>([])
  const [lv3Categories, setLv3Categories] = useState<CategoryType[]>([])
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

  const [selectedCategories, setSelectedCategories] = useState<
    CategoryType[] | ''
  >(defaultValue)

  const loadCategories = (
    filter: CategoryFilter,
    setCategories: React.Dispatch<React.SetStateAction<CategoryType[]>>
  ) => {
    setError('')
    setIsLoading(true)
    if (isActive) {
      listActiveCategories(filter)
        .then((res) => {
          const data = res.data
          if (data.error) {
            setError(data.error)
          } else {
            setCategories(data.categories)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error.message || String(error))
          setIsLoading(false)
        })
    } else {
      listCategories(filter)
        .then((res) => {
          const data = res.data
          if (data.error) {
            setError(data.error)
          } else {
            setCategories(data.categories)
          }
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error.message || String(error))
          setIsLoading(false)
        })
    }
  }

  useEffect(() => {
    loadCategories(lv1Filter, setLv1Categories)
  }, [lv1Filter])

  useEffect(() => {
    if (lv2Filter.categoryId) loadCategories(lv2Filter, setLv2Categories)
    else setLv2Categories([])
  }, [lv2Filter])

  useEffect(() => {
    if (lv3Filter.categoryId) loadCategories(lv3Filter, setLv3Categories)
    else setLv3Categories([])
  }, [lv3Filter])

  useEffect(() => {
    setSelectedCategories(defaultValue)
  }, [defaultValue])

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
      if (Array.isArray(selectedCategories)) {
        const temp = selectedCategories.map((cat) => cat._id)
        if (temp.indexOf(category._id) === -1) {
          const newSelected = [...selectedCategories, category]
          setSelectedCategories(newSelected)
          if (onSet) onSet(newSelected)
        }
      } else {
        setSelectedCategories([category])
        if (onSet) onSet([category])
      }
    }
  }

  const handleRemove = (index: number) => {
    if (Array.isArray(selectedCategories)) {
      const newArray = [...selectedCategories]
      newArray.splice(index, 1)

      if (newArray.length !== 0) {
        setSelectedCategories(newArray)
        if (onSet) onSet(newArray)
      } else {
        setSelectedCategories('')
        if (onSet) onSet('')
      }
    }
  }

  return (
    <div className='row'>
      <div className='col'>
        <SearchInput onChange={handleChangeKeyword} />
      </div>

      <div className='col-12 position-relative'>
        {isLoading && <Loading />}
        {error && <Error msg={error} />}

        <div className='d-flex border p-1 mt-2 rounded-2 bg-value'>
          <div
            className='list-group m-1'
            style={{
              width: '33.33333%',
              overflowY: 'auto',
              height: '250px'
            }}
          >
            {lv1Categories?.map((category: CategoryType, index: number) => (
              <div>
                <button
                  key={index}
                  type='button'
                  className={`list-group-item ripple list-group-item-action d-flex justify-content-between align-items-center ${
                    category._id === lv2Filter.categoryId && 'active'
                  }`}
                  onClick={() => handleClick(lv2Filter, setLv2Filter, category)}
                >
                  <span className='res-smaller-md'>{category.name}</span>
                  <i className='fa-solid fa-angle-right res-smaller-lg res-hide'></i>
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
            {lv2Categories?.map((category: CategoryType, index: number) => (
              <div>
                <button
                  key={index}
                  type='button'
                  className={`list-group-item ripple list-group-item-action d-flex justify-content-between align-items-center  ${
                    category._id === lv3Filter.categoryId && 'active'
                  }`}
                  onClick={() => handleClick(lv3Filter, setLv3Filter, category)}
                >
                  <span className='res-smaller-md'>{category.name}</span>
                  <i className='fa-solid fa-angle-right res-smaller-lg res-hide'></i>
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
            {lv3Categories?.map((category: CategoryType, index: number) => (
              <div>
                <button
                  key={index}
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
                          <i className='fa-solid fa-xmark'></i>
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
