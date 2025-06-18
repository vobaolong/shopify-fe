import { listSellingProductsByStore } from '../../apis/product.api'
import { Spin, Alert } from 'antd'
import ProductCard from '../card/ProductCard'
import Slider from 'react-slick'
import { useQuery } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'

const ListProductsByStore = ({
  heading = '',
  storeId = '',
  sortBy = 'sold'
}) => {
  const { notification } = useAntdApp()
  const settings = {
    className: 'center',
    infinite: false,
    speed: 600,
    slidesToShow: 5,
    slidesToScroll: 4,
    initialSlide: 0,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3
        }
      },
      {
        breakpoint: 820,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ]
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['productsByStore', storeId, sortBy],
    queryFn: async () =>
      listSellingProductsByStore(
        {
          search: '',
          rating: '',
          categoryId: '',
          minPrice: '',
          maxPrice: '',
          sortBy,
          order: 'desc',
          limit: 10,
          page: 1
        },
        storeId
      )
        .then((res) => {
          return res || { products: [] }
        })
        .catch((err) => {
          console.error('ListProductsByStore API Error:', err)
          notification.error({ message: err?.message || 'Server Error' })
          return { products: [] }
        })
  })
  const products: any[] = data?.products || []

  return (
    <div className='position-relative bg-body box-shadow rounded-2 p-3'>
      {' '}
      {heading && <h5 style={{ color: 'var(--muted-color)' }}>{heading}</h5>}
      {isLoading && <Spin size='large' />}
      {isError && (
        <Alert message={error?.message || 'Server Error'} type='error' />
      )}
      {/* Debug info */}
      <div
        style={{
          background: '#f0f0f0',
          padding: '10px',
          margin: '10px 0',
          fontSize: '12px'
        }}
      >
        <div>Products count: {products?.length || 0}</div>
        <div>Store ID: {storeId}</div>
        <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Has Error: {isError ? 'Yes' : 'No'}</div>
      </div>
      <div className='slider-container'>
        <Slider {...settings}>
          {products?.map((product: any, index: number) => (
            <div className='my-2' key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
      {/* Fallback when no products */}
      {!isLoading && (!products || products.length === 0) && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No products found for this store
        </div>
      )}
    </div>
  )
}

export default ListProductsByStore
