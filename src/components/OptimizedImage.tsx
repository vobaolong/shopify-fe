import React, { useState, useRef, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  lazy?: boolean
  placeholder?: string
  sizes?: string
  quality?: number
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  placeholder = '/placeholder.jpg',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(!lazy)
  const imgRef = useRef<HTMLImageElement>(null)
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [lazy, isInView])
  
  // Generate responsive image URLs (if using a CDN like Cloudinary)
  const generateSrcSet = (baseSrc: string) => {
    const widths = [320, 640, 768, 1024, 1280, 1920]
    return widths.map(w => `${baseSrc}?w=${w}&q=${quality} ${w}w`).join(', ')
  }
  
  const handleLoad = () => {
    setIsLoaded(true)
  }
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    ;(e.target as HTMLImageElement).src = placeholder
  }
  
  return (
    <div className={`image-container ${className}`} ref={imgRef}>
      {/* Loading placeholder */}
      {!isLoaded && (
        <div 
          className="loading-skeleton"
          style={{ 
            width: width || '100%', 
            height: height || '200px',
            borderRadius: '8px'
          }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          srcSet={generateSrcSet(src)}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{
            display: isLoaded ? 'block' : 'none',
            width: '100%',
            height: 'auto',
            borderRadius: '8px'
          }}
        />
      )}
    </div>
  )
}

// WebP support detection
export const useWebPSupport = () => {
  const [supportsWebP, setSupportsWebP] = useState(false)
  
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const dataURL = canvas.toDataURL('image/webp')
      setSupportsWebP(dataURL.indexOf('data:image/webp') === 0)
    }
    
    checkWebPSupport()
  }, [])
  
  return supportsWebP
}

// Progressive image loading
export const ProgressiveImage: React.FC<{
  src: string
  placeholder: string
  alt: string
  className?: string
}> = ({ src, placeholder, alt, className }) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setCurrentSrc(src)
      setIsLoaded(true)
    }
    img.src = src
  }, [src])
  
  return (
    <img
      src={currentSrc}
      alt={alt}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      style={{
        filter: isLoaded ? 'none' : 'blur(5px)',
        transition: 'filter 0.3s ease'
      }}
    />
  )
}
