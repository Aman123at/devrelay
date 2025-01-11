import { useLoader } from '@/contexts/LoaderContext'
import { Loader2 } from 'lucide-react'

export function Spinner() {
    const { isLoading } = useLoader()
    if (!isLoading) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-lg font-semibold text-blue-500">Loading...</p>
      </div>
    </div>
  )
}