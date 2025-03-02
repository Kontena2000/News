
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Only run on the client side
    if (typeof window === "undefined") return

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Initial check
    checkMobile()

    // Set up event listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the appropriate event listener method based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
      return () => mql.removeEventListener("change", checkMobile)
    } else {
      // Fallback for older browsers
      mql.addListener(checkMobile)
      return () => mql.removeListener(checkMobile)
    }
  }, [])

  return isMobile
}
