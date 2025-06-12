// Simple performance monitoring hook
import { useEffect, useState } from 'react'

interface SimpleMetrics {
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<SimpleMetrics>({
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  })

  useEffect(() => {
    // Simple performance measurement
    const measurePerformance = () => {
      const paintEntries = performance.getEntriesByType('paint')
      const fcp =
        paintEntries.find((entry) => entry.name === 'first-contentful-paint')
          ?.startTime || 0

      setMetrics((prev) => ({
        ...prev,
        firstContentfulPaint: fcp
      }))
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
    }
  }, [])

  const clearMetrics = () => {
    setMetrics({
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0
    })
  }

  return { metrics, clearMetrics }
}
