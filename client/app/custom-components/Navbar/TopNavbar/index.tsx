'use client'

import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

interface ITopNavProps {
  headerContent: React.ReactNode;
}

const TopNav = ({headerContent}:ITopNavProps) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setIsScrolled(scrollPosition > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <div
      className={cn(
        "sticky top-0 z-10 transition-colors duration-200",
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
      )}
    >
      {headerContent}
    </div>
  )
}

export default TopNav;