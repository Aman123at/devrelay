'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { addNewComment } from '@/apicalls/commentsApiCalls'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'

interface CommentFormProps {
  onSubmit: (e:React.FormEvent)=>void;
  content: string;
  setContent:Function;
}

export function CommentForm({ onSubmit,content,setContent }: CommentFormProps) {
  const {user} = useAuth()
  return (
    <form onSubmit={onSubmit} className="p-4 border-b">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Post your reply"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-0 focus-visible:ring-0"
          />
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim()}
              className="rounded-full bg-blue-500 hover:bg-blue-600"
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
