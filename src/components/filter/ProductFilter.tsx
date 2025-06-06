import React, { useEffect, useRef, useState } from 'react'
import StarRating from '../label/StarRating'
import { Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { getProvinces } from '../../apis/address.api'

interface ProductFilterProps {
  filter: any
  setFilter: (filter: any) => void
}

const ProductFilter: React.FC<ProductFilterProps> = ({ filter, setFilter }) => {
  const [provinces, setProvinces] = useState<any[]>([])
  const [provincesChecked, setProvincesChecked] = useState<any[]>([])
  const { t } = useTranslation()
  const [price, setPrice] = useState({
    min: 0,
    max: ''
  })
  const navigate = useNavigate()
  const location = useLocation()
  const [displayLimit, setDisplayLimit] = useState(5)

  const handleFilter = (name: string, value: any, order: string = 'desc') => {
    let newOrder = order
    if (value === 'asc' || value === 'desc') {
      newOrder = value
      value = 'salePrice'
    }

    setFilter({ ...filter, [name]: value, order: newOrder })

    const searchParams = new URLSearchParams(location.search)
    if (name !== 'provinces') {
      searchParams.set(name, value)
    }

    if (name === 'sortBy' && value === 'salePrice') {
      searchParams.set('order', newOrder)
    } else {
      searchParams.delete('order')
    }
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  const typingTimeoutRef = useRef<number | null>(null)

  const handleSetPrice = (name1: string, name2: string, value: any) => {
    setPrice({
      ...price,
      [name1]: value
    })
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleFilter(name2, value)
    }, 600)
  }

  const applyPriceFilter = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    handleFilter('minPrice', price.min)
    handleFilter('maxPrice', price.max)
  }

  const handleResetFilter = () => {
    setFilter({
      ...filter,
      rating: '',
      minPrice: 0,
      maxPrice: '',
      provinces: null
    })
    setPrice({
      min: 0,
      max: ''
    })
    setProvincesChecked([])
    const searchParams = new URLSearchParams(location.search)
    searchParams.delete('rating')
    searchParams.delete('minPrice')
    searchParams.delete('maxPrice')
    searchParams.delete('provinces')
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  const renderFilterRating = () => {
    const render = []
    for (let i = 0; i <= 5; i++)
      render.push(
        <div key={i} className='form-check'>
          <input
            className='form-check-input pointer'
            type='radio'
            name='rating'
            id={`rating${i}`}
            checked={i !== 0 ? filter.rating === i : filter.rating === ''}
            onChange={() => {}}
            onClick={() => {
              if (i === 0) handleFilter('rating', '')
              else handleFilter('rating', i)
            }}
          />
          <label className='form-check-label pointer' htmlFor={`rating${i}`}>
            {i === 0 ? (
              <span>{t('filters.all')}</span>
            ) : (
              <small>
                <StarRating stars={i} /> {i !== 5 && t('filters.up')}
              </small>
            )}
          </label>
        </div>
      )
    return render
  }

  const handleSelectProvince = (value: any) => {
    if (value === null) {
      if (provincesChecked.length !== 0) {
        setProvincesChecked(() => [])
        handleFilter('provinces', null)
      }
      return
    }
    if (provincesChecked.includes(value)) {
      const newProvincesChecked = provincesChecked.filter(
        (v: any) => v !== value
      )
      setProvincesChecked(() => [...newProvincesChecked])
      handleFilter('provinces', newProvincesChecked)
    } else {
      provincesChecked.push(value)
      setProvincesChecked(() => [...provincesChecked])
      handleFilter('provinces', provincesChecked)
    }
  }

  const fetchProvinces = async () => {
    const provincesRes = await getProvinces()
    setProvinces(Array.isArray(provincesRes) ? provincesRes : provincesRes.data)
  }
  useEffect(() => {
    fetchProvinces()
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <div
        className='flex items-center justify-content-between'
        style={{ width: '100%' }}
      >
        <button
          className='btn btn-primary rounded-1 ripple'
          style={{ width: 'max-content' }}
          type='button'
          data-bs-toggle='offcanvas'
          data-bs-target='#offcanvasFilter'
          aria-controls='offcanvasFilter'
        >
          <i className='fa-light fa-filter' />
          <span className='ms-2'>{t('filters.filter')}</span>
        </button>
        <select
          className='form-select rounded-1 pointer'
          style={{ width: 'max-content' }}
          value={filter.sortBy === 'salePrice' ? filter.order : filter.sortBy}
          onChange={(e) => {
            const value =
              e.target.value === 'sold'
                ? 'sold'
                : e.target.value === 'createdAt'
                  ? 'createdAt'
                  : 'salePrice'
            const order = e.target.value === 'asc' ? 'asc' : 'desc'
            handleFilter('sortBy', value, order)
          }}
        >
          <option value='sold'>{t('filters.topSale')}</option>
          <option value='createdAt'>{t('filters.latest')}</option>
          <option value='asc'>{t('filters.lowToHigh')}</option>
          <option value='desc'>{t('filters.hightToLow')}</option>
        </select>
      </div>
      <div
        className='offcanvas offcanvas-start'
        tabIndex={-1}
        id='offcanvasFilter'
        aria-labelledby='offcanvasFilterLabel'
      >
        <div className='offcanvas-header'>
          <i className='fa-light fa-filter me-2' />
          <h5
            className='offcanvas-title text-uppercase fw-bold'
            id='offcanvasFilterLabel'
          >
            {t('filters.filter')}
          </h5>
          <button
            type='button'
            className='btn-close text-reset'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          ></button>
        </div>
        <div className='offcanvas-body'>
          <div className='flex flex-column gap-2'>
            <p>{t('filters.shippedFrom')}</p>
            <div className='flex gap-3'>
              <input
                type='checkbox'
                checked={provincesChecked.length === 0}
                onChange={() => {
                  handleSelectProvince(null)
                }}
              />
              <p>{t('filters.all')}</p>
            </div>
            {provinces.slice(0, displayLimit).map((value: any) => (
              <div key={value} className='flex gap-3'>
                <input
                  type='checkbox'
                  checked={provincesChecked.includes(value)}
                  onChange={() => {
                    handleSelectProvince(value)
                  }}
                />
                <p>{value}</p>
              </div>
            ))}
            {provinces.length > displayLimit && (
              <button
                className='btn text-start fs-9'
                onClick={() => setDisplayLimit(provinces.length)}
              >
                Thêm <i className='fa-light fa-angle-down'> </i>
              </button>
            )}
          </div>
          <hr />
          <div className='mb-2'>
            <h6>{t('filters.price')}</h6>
            <form className='row'>
              <div className='col-md-6 col-sm-12'>
                <Input
                  type='number'
                  label={t('filters.min')}
                  feedback='Please provide a valid price.'
                  validator='position|zero'
                  value={price.min.toString()}
                  onChange={(value) => handleSetPrice('min', 'minPrice', value)}
                />
              </div>
              <div className='col-md-6 col-sm-12'>
                <Input
                  type='number'
                  label={t('filters.max')}
                  feedback='Please provide a valid price.'
                  validator='position|zero'
                  value={price.max.toString()}
                  onChange={(value) => handleSetPrice('max', 'maxPrice', value)}
                />
              </div>
              <div className='col-sm-12'>
                <button
                  className='btn btn-primary w-100 mt-3 rounded-1 ripple'
                  onClick={applyPriceFilter}
                >
                  {t('filters.apply')}
                </button>
              </div>
            </form>
          </div>
          <hr />
          <div className='mb-4'>
            <h6>{t('filters.rating')}</h6>
            {renderFilterRating()}
          </div>
          <hr />
          <button
            className='btn btn-primary w-100 mb-2 rounded-1 ripple'
            onClick={handleResetFilter}
          >
            {t('filters.reset')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductFilter
