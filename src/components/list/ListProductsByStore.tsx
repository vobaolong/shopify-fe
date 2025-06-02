import { listSellingProductsByStore } from '../../apis/product.api'
import Loading from '../ui/Loading'
import ProductCard from '../card/ProductCard'
import Slider from 'react-slick'
import Error from '../ui/Error'
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
        .then((res) => res.data)
        .catch((err) => {
          notification.error({ message: err?.message || 'Server Error' })
          return {}
        })
  })
  const products: any[] = data?.products || []

  return (
    <div className='position-relative bg-body box-shadow rounded-2 p-3'>
      {heading && <h5 style={{ color: 'var(--muted-color)' }}>{heading}</h5>}
      {isLoading && <Loading />}
      {isError && <Error msg={error?.message || 'Server Error'} />}

      <div className='slider-container'>
        <Slider {...settings}>
          {products?.map((product: any, index: number) => (
            <div className='my-2' key={index}>
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ListProductsByStore
