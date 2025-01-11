'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Home, Mail, Search, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useScroll } from '@/contexts/ScrollContext'

const mobileNavItems = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Search', href: '/search', icon: Search },
  { title: 'Notifications', href: '/notifications', icon: Bell },
  { title: 'Messages', href: '/messages', icon: Mail },
  { title: 'Profile', href: '/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { setShouldScrollToTop } = useScroll()

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault()
      setShouldScrollToTop(true)
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t lg:hidden">
      <div className="flex justify-around">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center py-2 px-3',
              pathname === item.href ? 'text-primary' : 'text-muted-foreground'
            )}
            onClick={item.title === 'Home' ? handleHomeClick : undefined}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
