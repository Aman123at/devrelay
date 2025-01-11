"use client";
import { addNewComment, fetchPostComments } from "@/apicalls/commentsApiCalls";
import { getPostDetail } from "@/apicalls/postsApiCalls";
import { CommentList } from "@/app/custom-components/Comments/CommentsList";
import { CommentForm } from "@/app/custom-components/Form/CommentForm";
import CommonPageLayout from "@/app/custom-components/Layout/CommonLayout";
import BackButtonHeader from "@/app/custom-components/Navbar/Header";
import CommonTile from "@/app/custom-components/CommonTile";
import { IPost } from "@/interfaces/interfaces";
import { convertStringToNumber } from "@/utils/helper";
import { Params } from "next/dist/server/request/params";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CommonDialog from "@/app/custom-components/Dialog/CommonDialog";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PostDetails = () => {
  const { postId }: Params = useParams();

  const [pageErr, setPageErr] = useState("");
  
  const [postDetails, setPostDetails] = useState<IPost | null>(null);

  const [postIdNum, setPostIdNum] = useState<number>(0);

  const [showReplyDialog, setShowReplyDialog] = useState<boolean>(false);

  const queryClient = new QueryClient();

  const [content, setContent] = useState("");

  const [commnetId, setCommentId] = useState<number | null>(null);

  const fetchPostDetail = async (postid: number) => {
    const response = await getPostDetail(postid);
    if (response.error) {
      setPageErr("Unable to find post.");
    }
    setPostDetails(response.post);
  };

  useEffect(() => {
    let num = convertStringToNumber(postId as string);
    if (Number.isNaN(num)) {
      setPageErr("PostId should be number");
    } else {
      // fetch post details
      if (num) {
        setPostIdNum(num);
        fetchPostDetail(num);
      }
    }
  }, []);

  const header = (
    <BackButtonHeader content={<p className="text-xl font-bold">Post</p>} />
  );

  const handleReplyOnComment = (commentID: number) => {
    setCommentId(commentID);
    setContent("");
    setShowReplyDialog(true);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await addNewComment({
      post_id: postIdNum,
      content,
      parent_id: commnetId ? commnetId : 0,
      is_top_level: commnetId ? false : true,
    });
    if (response.error) {
      console.log("Something went wrong while adding comment");
    } else {
      if (!commnetId) {
        toast({
          title: "Comment Posted Successfully",
          className: "bg-green-500 text-white border-none",
        });
      }
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    }

    setContent("");
    setCommentId(null);
    if (showReplyDialog) setShowReplyDialog(false);
  };

  const body = postDetails &&  postDetails.hasOwnProperty("postid") ? (
    <div>
      <CommonDialog
        body={
          <CommentForm
            onSubmit={handleCommentSubmit}
            content={content}
            setContent={setContent}
          />
        }
        header={
          <div className="flex justify-between items-center mx-2">
            <p className="font-bold text-lg">Sent Reply</p>{" "}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                setContent("");
                setCommentId(null);
                setShowReplyDialog(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        }
        open={showReplyDialog}
        onClose={() => setShowReplyDialog(false)}
      />
      <CommonTile
        username={postDetails.username}
        fullname={postDetails.fullname}
        timestamp={postDetails.created_at}
        avatarUrl={postDetails.avatar_url}
        content={postDetails.description}
        imageUrl={postDetails.image_url}
        likes={postDetails.likes}
        comments={postDetails.comments}
      />
      <CommentForm
        onSubmit={handleCommentSubmit}
        content={content}
        setContent={setContent}
      />
      <CommentList
        onCommentReply={handleReplyOnComment}
        postId={postId as string}
        fetchApiFn={(params: any) =>
          fetchPostComments(postId as string, { ...params })
        }
        queryKey="comments"
      />
    </div>
  ) : (
    <p className="text-lg font-bold">Details not available</p>
  );

  return pageErr ? (
    <p className="text-lg font-bold">{pageErr}</p>
  ) : (
    <CommonPageLayout pageHeader={header} pageBody={body} />
  );
};

export default PostDetails;
