import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export interface BreadcrumbPath {
  name: string
  url: string
}

interface BreadcrumbProps {
  paths: BreadcrumbPath[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ paths }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 150)
    }
    window.addEventListener('scroll', checkScroll)
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  if (!Array.isArray(paths)) {
    return null
  }

  return (
    <nav
      className={clsx(
        'transition-all duration-300 ease-in-out rounded-md p-2.5 z-10',
        isScrolled && 'sticky top-20 bg-white shadow-md translate-y-0',
        !isScrolled && 'relative -translate-y-5'
      )}
      aria-label='breadcrumb'
    >
      <ol className='breadcrumb mb-0'>
        {paths?.map((path, index) => (
          <li key={index} className='breadcrumb-item'>
            {index === paths.length - 1 ? (
              <Link className='breadcrumb-item active' to={path.url}>
                {path.name}
              </Link>
            ) : (
              <Link
                className='breadcrumb-item text-decoration-none'
                to={path.url}
              >
                {path.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
