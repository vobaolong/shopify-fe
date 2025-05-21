import { Link } from 'react-router-dom'
import chevronSvg from '../../assets/chevron-thin-right.svg'
import { CategoryType } from '../../@types/entity.types'

interface CategorySmallCardProps {
  category: CategoryType
  style?: React.CSSProperties
  parent?: boolean
}

const CategorySmallCard = ({
  category,
  style = {},
  parent = true
}: CategorySmallCardProps) => (
  <span className='d-inline-flex align-items-center' style={style}>
    <Link
      className='text-reset text-decoration-none cus-link-hover'
      to={`/category/${category._id}`}
    >
      <span>
        {parent &&
          category.categoryId &&
          typeof category.categoryId === 'object' &&
          'categoryId' in category.categoryId && (
            <>
              {category.categoryId.categoryId &&
                typeof category.categoryId.categoryId === 'object' &&
                'name' in category.categoryId.categoryId && (
                  <>
                    {category.categoryId.categoryId.name}{' '}
                    <img src={chevronSvg} alt='chevron' />{' '}
                  </>
                )}
            </>
          )}
        {parent &&
          category.categoryId &&
          typeof category.categoryId === 'object' &&
          'name' in category.categoryId && (
            <>
              {category.categoryId.name}{' '}
              <img src={chevronSvg} alt='chevron' />{' '}
            </>
          )}
        {category.name}
      </span>
    </Link>
  </span>
)

export default CategorySmallCard
