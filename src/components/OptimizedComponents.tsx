import React, { memo, useMemo, useCallback } from 'react'

// Higher-order component for performance optimization
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return memo((props: P) => {
    return <Component {...props} />
  })
}

// Optimized product list component
export const OptimizedProductList = memo(({ products, onProductClick }: {
  products: any[]
  onProductClick: (product: any) => void
}) => {
  const memoizedProducts = useMemo(() => {
    return products.map(product => ({
      ...product,
      formattedPrice: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(product.price)
    }))
  }, [products])
  
  const handleClick = useCallback((product: any) => {
    onProductClick(product)
  }, [onProductClick])
  
  return (
    <div className="product-grid">
      {memoizedProducts.map(product => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onClick={handleClick}
        />
      ))}
    </div>
  )
})

// Virtualized list for large datasets
export const VirtualizedProductList = memo(({ products }: { products: any[] }) => {
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 20 })
  
  const visibleProducts = useMemo(() => {
    return products.slice(visibleRange.start, visibleRange.end)
  }, [products, visibleRange])
  
  const handleScroll = useCallback((e: React.UIEvent) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const itemHeight = 200 // Approximate item height
    const containerHeight = container.clientHeight
    
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 5,
      products.length
    )
    
    setVisibleRange({ start, end })
  }, [products.length])
  
  return (
    <div 
      className="virtualized-list" 
      onScroll={handleScroll}
      style={{ height: '600px', overflowY: 'auto' }}
    >
      <div style={{ height: `${products.length * 200}px`, position: 'relative' }}>
        {visibleProducts.map((product, index) => (
          <div
            key={product.id}
            style={{
              position: 'absolute',
              top: `${(visibleRange.start + index) * 200}px`,
              width: '100%',
              height: '200px'
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
})

const ProductCard = memo(({ product, onClick }: {
  product: any
  onClick?: (product: any) => void
}) => {
  const handleClick = useCallback(() => {
    onClick?.(product)
  }, [product, onClick])
  
  return (
    <div className="product-card" onClick={handleClick}>
      <img 
        src={product.image} 
        alt={product.name}
        loading="lazy"
        decoding="async"
      />
      <h3>{product.name}</h3>
      <p>{product.formattedPrice || product.price}</p>
    </div>
  )
})
