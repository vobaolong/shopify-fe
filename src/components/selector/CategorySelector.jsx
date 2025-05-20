import { useState, useEffect } from 'react'
import { getToken } from '../../apis/auth'
import { useActiveCategories, useCategories } from '../../hooks/useCategory'
import SearchInput from '../ui/SearchInput'
import CategorySmallCard from '../card/CategorySmallCard'
import Loading from '../ui/Loading'
import { useTranslation } from 'react-i18next'
import Error from '../ui/Error'

const CategorySelector = ({
  defaultValue = '',
  isActive = false,
  selected = 'child',
  label = 'Chosen category',
  onSet = () => {},
  isSelected = true,
  isRequired = false
}) => {
  const { t } = useTranslation()
  const { _id: userId } = getToken() || {}
  const [selectedCategory, setSelectedCategory] = useState(defaultValue)

  // Define filters
  const [lv1Filter, setLv1Filter] = useState({
    search: '',
    categoryId: null,
    sortBy: 'name',
    order: 'asc',
    limit: 100,
    page: 1
  })
  const [lv2Filter, setLv2Filter] = useState({
    search: '',
    categoryId: '',
    sortBy: 'name',
    order: 'asc',
    limit: 100,
    page: 1
  })
  const [lv3Filter, setLv3Filter] = useState({
    search: '',
    categoryId: '',
    sortBy: 'name',
    order: 'asc',
    limit: 100,
    page: 1
  })

  // Call both hooks non-conditionally
  // For active categories
  const {
    data: activeLv1Data,
    isLoading: isLoadingActiveLv1,
    error: errorActiveLv1
  } = useActiveCategories(lv1Filter)

  const {
    data: activeLv2Data,
    isLoading: isLoadingActiveLv2,
    error: errorActiveLv2
  } = useActiveCategories(lv2Filter)

  const {
    data: activeLv3Data,
    isLoading: isLoadingActiveLv3,
    error: errorActiveLv3
  } = useActiveCategories(lv3Filter)

  // For regular categories (requiring userId)
  const {
    data: regularLv1Data,
    isLoading: isLoadingRegularLv1,
    error: errorRegularLv1
  } = useCategories(userId, lv1Filter)

  const {
    data: regularLv2Data,
    isLoading: isLoadingRegularLv2,
    error: errorRegularLv2
  } = useCategories(userId, lv2Filter)

  const {
    data: regularLv3Data,
    isLoading: isLoadingRegularLv3,
    error: errorRegularLv3
  } = useCategories(userId, lv3Filter)

  // Choose which data to use based on isActive flag
  const lv1Data = isActive ? activeLv1Data : regularLv1Data
  const lv2Data = isActive ? activeLv2Data : regularLv2Data
  const lv3Data = isActive ? activeLv3Data : regularLv3Data

  const isLoadingLv1 = isActive ? isLoadingActiveLv1 : isLoadingRegularLv1
  const isLoadingLv2 = isActive ? isLoadingActiveLv2 : isLoadingRegularLv2
  const isLoadingLv3 = isActive ? isLoadingActiveLv3 : isLoadingRegularLv3

  const errorLv1 = isActive ? errorActiveLv1 : errorRegularLv1
  const errorLv2 = isActive ? errorActiveLv2 : errorRegularLv2
  const errorLv3 = isActive ? errorActiveLv3 : errorRegularLv3

  // Extract categories from data
  const lv1Categories = lv1Data?.categories || []
  const lv2Categories = lv2Data?.categories || []
  const lv3Categories = lv3Data?.categories || []

  // Determine overall loading and error states
  const isLoading = isLoadingLv1 || isLoadingLv2 || isLoadingLv3
  const error =
    errorLv1?.message || errorLv2?.message || errorLv3?.message || ''

  // Sync selected category with defaultValue
  useEffect(() => {
    setSelectedCategory(defaultValue)
  }, [defaultValue])

  const handleChangeKeyword = (keyword) => {
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

  const handleClick = (filter, setFilter, category) => {
    if ((setFilter, filter))
      setFilter({
        ...filter,
        categoryId: category._id
      })

    if (filter === lv2Filter)
      setLv3Filter({
        ...lv3Filter,
        categoryId: ''
      })

    if (isSelected)
      if (
        (selected === 'parent' && filter === lv2Filter) ||
        (selected === 'parent' && filter === lv3Filter) ||
        (selected === 'child' && filter === null)
      ) {
        setSelectedCategory(category)
        if (onSet) onSet(category)
      }
  }

  const handleDelete = () => {
    setSelectedCategory('')
    if (onSet) onSet('')
  }

  return (
    <div className='row'>
      <div className='col'></div>
      <div className='col-12 position-relative'>
        <SearchInput onChange={handleChangeKeyword} />

        {isLoading && <Loading />}
        {error && <Error msg={error} />}
        <div className='d-flex border rounded-1 p-2 mt-2 bg-body'>
          <div
            className='list-group m-1'
            style={{
              width: '33.33333%',
              overflowY: 'auto',
              height: '250px'
            }}
          >
            {lv1Categories?.map((category, index) => (
              <div key={index}>
                <button
                  type='button'
                  className={`list-group-item ripple list-group-item-action d-flex justify-content-between align-items-center  ${
                    category._id === lv2Filter.categoryId ? 'active' : ''
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
            {lv2Categories?.map((category, index) => (
              <div key={index}>
                <button
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
            {lv3Categories?.map((category, index) => (
              <div key={index}>
                <button
                  type='button'
                  className={`list-group-item ripple list-group-item-action ${
                    category._id === selectedCategory?._id ? 'active' : ''
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
              className='position-absolute text-muted fs-9'
              style={{
                top: '-20px'
              }}
            >
              {label}
            </label>

            <div
              style={{ height: '100%', maxHeight: '300px', overflow: 'auto' }}
              className='form-control border bg-light-subtle d-flex flex-column gap-3'
            >
              {selectedCategory ? (
                <div className='position-relative'>
                  <div className='me-5'>
                    <CategorySmallCard category={selectedCategory} />
                  </div>

                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm ripple position-absolute'
                    style={{
                      top: '50%',
                      transform: 'translateY(-50%)',
                      right: '0'
                    }}
                    onClick={() => handleDelete()}
                  >
                    <i className='fa-solid fa-xmark text-danger'></i>
                  </button>
                </div>
              ) : (
                <span className={isRequired ? 'text-danger' : ''}>
                  {t('variantDetail.required')}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategorySelector
