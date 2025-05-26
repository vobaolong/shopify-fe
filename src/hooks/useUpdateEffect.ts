import { useEffect, useRef, DependencyList } from 'react'

/**
 * Custom hook that runs an effect only on updates (skips the first render)
 * @param callback - The effect callback function
 * @param dependencies - The dependency array for the effect
 */
const useUpdateEffect = (
  callback: () => void | (() => void),
  dependencies?: DependencyList
): void => {
  const firstRenderRef = useRef<boolean>(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    return callback()
  }, dependencies)
}

export default useUpdateEffect
