'use client'

import React, { createContext, useContext, useState } from 'react'

type ScrollContextType = {
  shouldScrollToTop: boolean
  setShouldScrollToTop: (value: boolean) => void
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [shouldScrollToTop, setShouldScrollToTop] = useState<boolean>(false)

  return (
    <ScrollContext.Provider value={{ shouldScrollToTop, setShouldScrollToTop }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScroll() {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider')
  }
  return context
}