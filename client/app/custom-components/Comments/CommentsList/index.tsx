"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SkeletonLoader from "../../Loader/SkeletonLoader";
import CommonTile from "../../CommonTile";

interface CommentListProps {
  postId: string;
  fetchApiFn: any;
  queryKey: string;
  onCommentReply?: (commentId: number) => void;
}

export function CommentList({
  postId,
  queryKey,
  fetchApiFn,
  onCommentReply
}: CommentListProps) {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey, postId],
      queryFn: fetchApiFn,
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => lastPage.nextPage,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (status === "pending") {
    return (
      <div className="pt-16">
        <SkeletonLoader length={5} />
      </div>
    );
  }

  interface IComment {
    avatar_url: string;
    commentId: number;
    content: string;
    fullname: string;
    is_top_level: boolean;
    post_id: number;
    replies: ICommentReply[];
    updated_at: string;
    user_id: number;
    username: string;
  }

  interface ICommentReply {
    avatar_url: string;
    commentId: number;
    content: string;
    fullname: string;
    updated_at: string;
    user_id: number;
    username: string;
  }

  const handleCommentsReply = (commentID:number)=>{
    if(onCommentReply) onCommentReply(commentID)
  }

  return (
    <div className="space-y-4 pt-4">
      {data?.pages.map((page: any) =>
        page.comments.map((comment: IComment) => (
          <div key={comment.commentId}>
            <CommonTile
              key={comment.commentId}
              username={comment.username}
              fullname={comment.fullname}
              avatarUrl={comment.avatar_url}
              content={comment.content}
              timestamp={comment.updated_at}
              imageUrl=""
              showBookmarks={false}
              showLikes={false}
              showShare={false}
              onCommentsClick={()=>handleCommentsReply(comment.commentId)}
              // hideBorders={comment.replies.length>0 ? true: false}
            />
            <div>
              {comment.replies.length>0 && comment.replies.map((reply:ICommentReply)=>
                <CommonTile
                key={reply.commentId}
                username={reply.username}
                fullname={reply.fullname}
                avatarUrl={reply.avatar_url}
                content={reply.content}
                timestamp={reply.updated_at}
                imageUrl=""
                hideFooter={true}
                nested={true}
              />
              )}
            </div>
          </div>
        ))
      )}
      <div ref={ref} className="h-8" />
      {isFetchingNextPage && (
        <div className="space-y-4">
          <SkeletonLoader length={2} />
        </div>
      )}
    </div>
  );
}
