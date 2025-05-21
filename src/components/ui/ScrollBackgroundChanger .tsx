import React, { useState, useEffect, ReactNode } from 'react'

interface ScrollBackgroundChangerProps {
  threshold: number
  solidClassName: string
  children: ReactNode
}

const ScrollBackgroundChanger: React.FC<ScrollBackgroundChangerProps> = ({
  threshold,
  solidClassName,
  children
}) => {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isSolidBackground, setIsSolidBackground] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
      setIsSolidBackground(position > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [threshold])

  const navBackgroundClass = isSolidBackground ? solidClassName : ''

  return <div className={navBackgroundClass}>{children}</div>
}

export default ScrollBackgroundChanger
