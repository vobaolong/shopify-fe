import { useActiveCategories } from '../../hooks/useCategory'
import CategoryCard from '../card/CategoryCard'
import Slider from 'react-slick'
import { useAntdApp } from '../../hooks/useAntdApp'
import { Alert, Spin } from 'antd'

const ListCategories = ({ heading = '', categoryId = null }) => {
  const { notification } = useAntdApp()
  // Use the custom hook instead of direct API call
  const { data, isLoading, error } = useActiveCategories({
    search: '',
    categoryId,
    sortBy: 'name',
    order: 'asc',
    limit: 20,
    page: 1
  })

  if (error) {
    notification.error({ message: error?.message || 'Server Error' })
  }

  let categories: any[] = []

  categories = data?.categories || []

  const settings = {
    className: 'center',
    infinite: false,
    speed: 900,
    slidesToShow: Math.min(categories.length, 8),
    slidesToScroll: Math.min(categories.length, 7),
    centerPadding: '25%',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(categories.length, 6),
          slidesToScroll: Math.min(categories.length, 5)
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(categories.length, 4),
          slidesToScroll: Math.min(categories.length, 3)
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(categories.length, 2),
          slidesToScroll: Math.min(categories.length, 1)
        }
      }
    ]
  }

  return (
    <>
      {error && (
        <Alert message={error?.message || 'Server Error'} type='error' />
      )}
      {categories.length > 0 && (
        <div className='bg-body box-shadow rounded-3 p-3'>
          {heading && <h5>{heading}</h5>}
          {isLoading && <Spin />}
          <div className='slider-container'>
            <Slider {...settings}>
              {categories?.map((category: any, index: number) => (
                <div key={index}>
                  <CategoryCard category={category} />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      )}
    </>
  )
}

export default ListCategories
