import { memo } from 'react'
import { listActiveProducts } from '../../apis/product.api'
import ProductCard from '../card/ProductCard'
import Slider from 'react-slick'
import { useQuery } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'
import { Spin } from 'antd'

const ProductCardMemo = memo(ProductCard)
const settings = {
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
        slidesToScroll: 1
      }
    }
  ]
}

const ListBestSellerProduct = ({
  sortBy = '',
  heading = '',
  categoryId = ''
}: {
  sortBy?: string
  heading?: string
  categoryId?: string
}) => {
  const { notification } = useAntdApp()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bestSellerProducts', categoryId, sortBy],
    queryFn: async () => {
      try {
        const res = await listActiveProducts({
          search: '',
          rating: '',
          categoryId,
          minPrice: '',
          maxPrice: '',
          sortBy: sortBy,
          order: 'desc',
          limit: 20,
          page: 1
        })
        return res || { products: [] }
      } catch (err: any) {
        notification.error({ message: err?.message || 'Server Error' })
        throw err
      }
    },
    retry: 1,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  const products: any[] = data?.products || []

  return (
    <div className='position-relative bg-body box-shadow rounded-2 p-3'>
      {heading && <h5 className='text-dark-emphasis'>{heading}</h5>}

      {isLoading && <Spin />}

      {!isLoading && !isError && products.length > 0 && (
        <div className='slider-container'>
          <Slider {...settings}>
            {products.map((product: any, index: number) => (
              <div className='my-2' key={product.id || index}>
                <ProductCardMemo product={product} />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {!isLoading && (!products || products.length === 0) && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No products found
        </div>
      )}
    </div>
  )
}

export default ListBestSellerProduct
