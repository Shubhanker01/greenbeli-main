import { useEffect, useState } from 'react'
import { HiOutlineArrowUp } from 'react-icons/hi2'

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 240)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 text-white shadow-[0_16px_35px_rgba(15,23,42,0.22)] transition-all duration-300 hover:bg-emerald-800 ${isVisible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <HiOutlineArrowUp className="h-5 w-5" />
    </button>
  )
}

export default ScrollToTopButton
