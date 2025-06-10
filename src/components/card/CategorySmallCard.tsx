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
}: CategorySmallCardProps) => {
  const getCategoryLine = (cat: CategoryType) => {
    const nodes: React.ReactNode[] = []
    let current: any = cat
    const stack: string[] = []
    while (
      current &&
      current.categoryId &&
      typeof current.categoryId === 'object' &&
      'name' in current.categoryId
    ) {
      stack.unshift(current.categoryId.name)
      current = current.categoryId
    }
    stack.push(cat.name)
    stack.forEach((name, idx) => {
      nodes.push(
        <span key={name + idx} className='inline-flex items-center'>
          {name}
          {idx < stack.length - 1 && (
            <img src={chevronSvg} alt='chevron' className='mx-1' />
          )}
        </span>
      )
    })
    return nodes
  }

  return (
    <span className='flex items-center' style={style}>
      <Link
        className='text-reset text-decoration-none cus-link-hover'
        to={`/category/${category._id}`}
      >
        <span className='flex items-center'>{getCategoryLine(category)}</span>
      </Link>
    </span>
  )
}

export default CategorySmallCard
