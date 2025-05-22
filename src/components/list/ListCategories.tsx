import { useActiveCategories } from '../../hooks/useCategory'
import Loading from '../ui/Loading'
import Error from '../ui/Error'
import CategoryCard from '../card/CategoryCard'
import Slider from 'react-slick'
import { notification } from 'antd'

const ListCategories = ({ heading = '', categoryId = null }) => {
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
  if (data) {
    if ('data' in data && data.data) {
      categories = data.data.categories || []
    } else {
      categories = (data as any).categories || []
    }
  }

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
      {categories.length > 0 && (
        <div className='bg-body box-shadow rounded-3 p-3'>
          {heading && <h5>{heading}</h5>}
          {isLoading && <Loading />}
          {error && <Error msg={error?.message || 'Server Error'} />}
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
