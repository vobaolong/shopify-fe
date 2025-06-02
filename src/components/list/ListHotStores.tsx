import { useQuery } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'
import { getListStores } from '../../apis/store.api'
import Loading from '../ui/Loading'
import StoreCard from '../card/StoreCard'
import Slider from 'react-slick'
import Error from '../ui/Error'

const ListHotStores = ({ heading = '' }) => {
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
          slidesToScroll: 1
        }
      }
    ]
  }
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['hotStores'],
    queryFn: async () =>
      getListStores({
        search: '',
        sortBy: 'rating',
        sortMoreBy: 'point',
        isActive: 'true',
        order: 'desc',
        limit: 10,
        page: 1
      })
        .then((res) => res.data)
        .catch((err) => {
          notification.error({ message: err?.message || 'Server Error' })
          return {}
        })
  })
  const stores: any[] = data?.stores || []

  return (
    <div className='position-relative bg-body box-shadow rounded-3 p-3'>
      {heading && <h5>{heading}</h5>}
      {isLoading && <Loading />}
      {isError && <Error msg={error?.message || 'Server Error'} />}
      <div className='slider-container'>
        <Slider {...settings}>
          {stores?.map((store: any, index: number) => (
            <div className='my-2' key={index}>
              <StoreCard store={store} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ListHotStores
