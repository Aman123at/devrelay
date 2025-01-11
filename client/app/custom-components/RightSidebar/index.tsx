"use client";
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const RightSideBar = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search"
            className="pl-8"
          />
        </div>
      </div>
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>What&apos;s happening</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <p className="text-sm text-muted-foreground">Trending in Technology</p>
              <p className="font-semibold">Next.js 14</p>
              <p className="text-sm text-muted-foreground">34.5K posts</p>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full justify-start">Show more</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default RightSideBar;

