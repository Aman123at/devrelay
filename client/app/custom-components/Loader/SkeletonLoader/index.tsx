import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
interface ISkeletonLoaderProps {
    length?: number
}
const SkeletonLoader = ({length = 2}:ISkeletonLoaderProps) => {
  return (
    <div className="space-y-4">
    {Array.from({ length }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
        </div>
        </div>
    ))}
    </div>
  )
}

export default SkeletonLoader