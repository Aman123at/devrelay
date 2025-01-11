"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

import { useScroll } from "@/contexts/ScrollContext";
import CommonTile from "../CommonTile";
import SkeletonLoader from "../Loader/SkeletonLoader";
import { IPost } from "@/interfaces/interfaces";
import { useRouter } from "next/navigation";

interface IFeedProps {
  fetchApiFn: any;
  queryKey: string;
}

const Feed = ({ fetchApiFn, queryKey }: IFeedProps) => {
  const { ref, inView } = useInView();
  const { shouldScrollToTop, setShouldScrollToTop } = useScroll();
  const feedRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchApiFn,
      initialPageParam: 1,
      getNextPageParam: (lastPage: any) => lastPage.nextPage,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  useEffect(() => {
    if (shouldScrollToTop && feedRef.current) {
      feedRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      setShouldScrollToTop(false);
    }
  }, [shouldScrollToTop, setShouldScrollToTop]);

  if (status === "pending") {
    return (
      <div className="pt-16">
        <SkeletonLoader length={5} />
      </div>
    );
  }

  return (
    <div ref={feedRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="pt-2">
        {data?.pages.map((page) =>
          page.hasOwnProperty("posts") ? (
            page.posts.map((post: IPost) => (
              <CommonTile
                key={post.postid}
                username={post.username}
                fullname={post.fullname}
                timestamp={post.created_at}
                avatarUrl={post.avatar_url}
                content={post.description}
                imageUrl={post.image_url}
                likes={post.likes}
                comments={post.comments}
                navigationUrl={`/pages/post/${post.postid}`}
                onCommentsClick={()=>router.push(`/pages/post/${post.postid}`)}
              />
            ))
          ) : (
            <p key={Math.random()} className="text-xl">
              No Posts Found.
            </p>
          )
        )}
        <div ref={ref} className="h-8" />
        {isFetchingNextPage && <SkeletonLoader />}
      </div>
    </div>
  );
};

export default Feed;
