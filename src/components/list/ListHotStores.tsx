import { useQuery } from '@tanstack/react-query'
import { useAntdApp } from '../../hooks/useAntdApp'
import { getListStores } from '../../apis/store.api'
import { Spin, Alert } from 'antd'
import StoreCard from '../card/StoreCard'
import Slider from 'react-slick'

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
        .then((res) => {
          console.log('ListHotStores API Response:', res)
          console.log('ListHotStores API Response stores:', res?.stores)
          console.log(
            'ListHotStores API Response stores length:',
            res?.stores?.length
          )
          return res || { stores: [] }
        })
        .catch((err) => {
          console.error('ListHotStores API Error:', err)
          notification.error({ message: err?.message || 'Server Error' })
          return { stores: [] }
        })
  })

  const stores: any[] = data?.stores || []

  console.log('ListHotStores - Final stores:', stores)
  console.log('ListHotStores - Stores length:', stores.length)
  console.log('ListHotStores - Data:', data)
  console.log(
    'ListHotStores - Data keys:',
    data ? Object.keys(data) : 'no data'
  )
  return (
    <div className='position-relative bg-body box-shadow rounded-3 p-3'>
      {' '}
      {heading && <h5>{heading}</h5>}
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
        <div>Stores count: {stores?.length || 0}</div>
        <div>Is Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Has Error: {isError ? 'Yes' : 'No'}</div>
      </div>
      <div className='slider-container'>
        <Slider {...settings}>
          {stores?.map((store: any, index: number) => (
            <div className='my-2' key={index}>
              <StoreCard store={store} />
            </div>
          ))}
        </Slider>
      </div>
      {/* Fallback when no stores */}
      {!isLoading && (!stores || stores.length === 0) && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
          No stores found
        </div>
      )}
    </div>
  )
}

export default ListHotStores
