import { Link } from 'react-router-dom'
import chevronSvg from '../../assets/chevron-thin-right.svg'
import { CategoryType } from '../../@types/entity.types'
import { Tag } from 'antd'

interface CategorySmallCardProps {
  category: CategoryType
}

const CategorySmallCard = ({ category }: CategorySmallCardProps) => {
  const getCategoryLine = (cat: CategoryType) => {
    const nodes: React.ReactNode[] = []
    let current: any = cat
    const stack: string[] = []
    while (
      current?.categoryId &&
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
    <Tag>
      <Link
        className='!no-underline cus-link-hover'
        to={`/category/${category._id}`}
      >
        <span className='flex items-center'>{getCategoryLine(category)}</span>
      </Link>
    </Tag>
  )
}

export default CategorySmallCard
