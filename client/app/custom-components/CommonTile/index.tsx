"use client";
import { formatDistanceToNow } from "date-fns";
import {
  Bookmark,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Share,
} from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
// import { IPost } from '@/interfaces/interfaces'
import Link from "next/link";
import { MouseEventHandler } from "react";
// import { useRouter } from 'next/navigation';

interface ICommonTileProps {
  username: string;
  timestamp: string;
  fullname: string;
  avatarUrl: string;
  content: string;
  imageUrl: string;
  likes?: number;
  comments?: number;
  navigationUrl?: string;
  onCommentsClick?: MouseEventHandler<HTMLButtonElement>;
  onLikesClick?: MouseEventHandler<HTMLButtonElement>;
  hideFooter?: boolean;
  showLikes?: boolean;
  showBookmarks?: boolean;
  showShare?: boolean;
  nested?: boolean;
}

const CommonTile = ({
  username,
  timestamp,
  fullname,
  avatarUrl,
  content,
  imageUrl,
  likes = 0,
  comments = 0,
  navigationUrl = "",
  onCommentsClick,
  onLikesClick,
  hideFooter = false,
  showLikes = true,
  showBookmarks = true,
  showShare = true,
  nested=false
}: ICommonTileProps) => {
  return (
    <Card className={`rounded-none ${nested ? "ml-14" : ""} border-x-0 border-t-0 bg-transparent`}>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{fullname}</span>
              <span className="text-muted-foreground">@{username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">
                {formatDistanceToNow(timestamp)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Link href={navigationUrl}>
        <CardContent
          className={`pb-2 ${
            navigationUrl ? "cursor-pointer" : "cursor-default"
          } xl:ml-14`}
        >
          <p className="whitespace-pre-wrap">{content}</p>
          {imageUrl && (
            <div className={cn("mt-3 grid gap-2 grid-cols-1")}>
              <div
                className={cn(
                  "relative aspect-square overflow-hidden rounded-2xl bg-muted"
                )}
              >
                <Image
                  src={imageUrl}
                  alt="Post image"
                  className="object-cover"
                  loading="lazy"
                  fill
                />
              </div>
            </div>
          )}
        </CardContent>
      </Link>
      {!hideFooter && (
        <CardFooter>
          <div className="flex w-full items-center justify-between lg:ml-14 xl:ml-14">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-muted-foreground"
              onClick={onCommentsClick && onCommentsClick}
            >
              <MessageCircle className="h-4 w-4" />
              <span className=" text-sm">{comments}</span>
            </Button>
            {showBookmarks && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground"
              >
                <Bookmark className="h-4 w-4" />
                <span className="ml-2 text-sm">{0}</span>
              </Button>
            )}
            {showLikes && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground"
              >
                <Heart className="h-4 w-4" />
                <span className="ml-2 text-sm">{likes}</span>
              </Button>
            )}
            {showShare && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground"
              >
                <Share className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CommonTile;
