import { useNavigate, useLocation } from 'react-router-dom'

interface PaginationProps {
  pagination: {
    pageCurrent: number
    pageCount: number
  }
  onChangePage?: (page: number) => void
  isSmall?: boolean
}

const pages = (pageCurrent: number, pageCount: number) => {
  let topPages: number[] = []
  let midPages: number[] = []
  let botPages: number[] = []

  for (let i = 1; i <= 2; i++) {
    if (i < pageCurrent - 2) {
      topPages.push(i)
    }
  }
  if (pageCount <= 0) midPages = [1]
  for (let i = pageCurrent - 2; i <= pageCurrent + 2; i++) {
    if (i > 0 && i <= pageCount) {
      midPages.push(i)
    }
  }
  for (let i = pageCount; i >= pageCount - 2; i--) {
    if (i > pageCurrent + 2) {
      botPages.unshift(i)
    }
  }
  return {
    topPages,
    midPages,
    botPages
  }
}

const Pagination: React.FC<PaginationProps> = ({
  pagination = { pageCurrent: 1, pageCount: 1 },
  onChangePage = () => {},
  isSmall = false
}) => {
  const { pageCurrent, pageCount } = pagination
  const { topPages, midPages, botPages } = pages(pageCurrent, pageCount)
  const navigate = useNavigate()
  const location = useLocation()
  const handleChangePage = (newPage: number) => {
    const searchParams = new URLSearchParams(location.search)
    searchParams.set('page', newPage.toString())
    navigate(`${location.pathname}?${searchParams.toString()}`)
    if (onChangePage) {
      onChangePage(newPage)
    }
  }
  return (
    <nav className='my-2'>
      <ul className='pagination justify-content-center m-0'>
        <div className='btn-group gap-1' role='group' aria-label=''>
          {pageCurrent > 1 && (
            <button
              type='button'
              disabled={pageCurrent <= 1}
              className='btn btn-outline-value rounded-1 ripple p-1'
              style={{ minWidth: '35px' }}
              onClick={() => handleChangePage(1)}
            >
              <i className='fa-solid fa-angles-left' />
            </button>
          )}
          {pageCurrent > 1 && (
            <button
              type='button'
              disabled={pageCurrent <= 1}
              className='btn btn-outline-value rounded-1 ripple p-1'
              style={{ minWidth: '35px' }}
              onClick={() => handleChangePage(pageCurrent - 1)}
            >
              <i className='fa-solid fa-angle-left' />
            </button>
          )}
          {!isSmall && (
            <>
              {topPages.map((p) => (
                <button
                  type='button'
                  key={p}
                  className='btn btn-outline-value ripple res-hide-md rounded-1'
                  style={{ minWidth: '35px' }}
                  onClick={() => handleChangePage(p)}
                >
                  {p}
                </button>
              ))}

              {midPages[0] - 1 !== topPages[topPages.length - 1] &&
                midPages[0] > 1 && (
                  <button
                    disabled
                    type='button'
                    className='btn btn-outline-value ripple res-hide-md p-1 rounded-1'
                    style={{ minWidth: '35px' }}
                  >
                    ...
                  </button>
                )}

              {midPages.map((p) => (
                <button
                  type='button'
                  key={p}
                  className={`btn p-1 rounded-1 ${
                    p === pageCurrent ? 'btn-value' : 'btn-outline-value'
                  } ripple res-hide-md`}
                  style={{ minWidth: '35px' }}
                  onClick={
                    p === pageCurrent ? () => {} : () => handleChangePage(p)
                  }
                >
                  {p}
                </button>
              ))}

              {midPages[midPages.length - 1] !== botPages[0] - 1 &&
                midPages[midPages.length - 1] < pageCount && (
                  <button
                    disabled
                    type='button'
                    className='btn btn-outline-value ripple res-hide-md p-1 rounded-1'
                    style={{ minWidth: '35px' }}
                  >
                    ...
                  </button>
                )}

              {botPages.map((p) => (
                <button
                  type='button'
                  key={p}
                  className='btn btn-outline-value ripple res-hide-md p-1 rounded-1'
                  style={{ minWidth: '35px' }}
                  onClick={() => handleChangePage(p)}
                >
                  {p}
                </button>
              ))}
            </>
          )}

          {pageCurrent < pageCount && (
            <button
              type='button'
              disabled={pageCurrent >= pageCount}
              className='btn btn-outline-value ripple p-1 rounded-1'
              style={{ minWidth: '35px' }}
              onClick={() => handleChangePage(pageCurrent + 1)}
            >
              <i className='fa-solid fa-angle-right' />
            </button>
          )}
          {pageCurrent < pageCount && (
            <button
              type='button'
              disabled={pageCurrent >= pageCount}
              className='btn btn-outline-value ripple p-1 rounded-1'
              style={{ minWidth: '35px' }}
              onClick={() => handleChangePage(pageCount)}
            >
              <i className='fa-solid fa-angles-right' />
            </button>
          )}
        </div>
      </ul>
    </nav>
  )
}

export default Pagination
