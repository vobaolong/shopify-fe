import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useActiveCategories } from '../../hooks/useCategory'
import defaultImage from '../../assets/default.webp'
import { Card, Skeleton, Typography } from 'antd'
import { CategoryType } from '../../@types/entity.types'

const { Text } = Typography

interface CategoryCardProps {
  category: CategoryType
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  const [categoryValue, setCategoryValue] = useState<CategoryType>(category)
  const [isLoading, setIsLoading] = useState(true)

  const filters = {
    search: '',
    categoryId: category._id || '',
    sortBy: 'name',
    order: 'asc',
    limit: 3,
    page: 1
  }

  const { isLoading: isChildLoading } = useActiveCategories(filters)

  useEffect(() => {
    setCategoryValue(category)
    setIsLoading(isChildLoading)
  }, [category, isChildLoading])

  return (
    <Card className='card-sm py-3' bordered={false} bodyStyle={{ padding: 0 }}>
      <div className='bg-body-secondary rounded-circle m-auto w-75'>
        <Link
          className='text-reset text-decoration-none'
          to={`/category/${categoryValue._id}`}
          title={categoryValue.name}
        >
          <div className='card-img-top cus-card-img-top'>
            {isLoading ? (
              <Skeleton.Avatar active size={100} shape='circle' />
            ) : (
              <img
                loading='lazy'
                src={categoryValue.image ? categoryValue.image : defaultImage}
                className='cus-card-img rounded-circle border'
                alt={categoryValue.name}
              />
            )}
          </div>
        </Link>
      </div>

      <div className='card-body p-0'>
        <Link
          className='text-reset link-hover d-block mt-1 text-center'
          to={`/category/${categoryValue._id}`}
          title={categoryValue.name}
        >
          {isLoading ? (
            <Skeleton.Input style={{ width: 100 }} active size='small' />
          ) : (
            <Text
              className='card-title'
              style={{
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
              ellipsis={{ tooltip: categoryValue.name }}
            >
              {categoryValue.name}
            </Text>
          )}
        </Link>
      </div>
    </Card>
  )
}

export default CategoryCard
