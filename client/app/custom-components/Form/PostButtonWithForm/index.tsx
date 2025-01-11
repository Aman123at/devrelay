import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Calendar,
  Film,
  ImageIcon,
  MapPin,
  PenSquare,
  Smile,
  X,
} from "lucide-react";
import React, { useRef, useState } from "react";
import CommonDialog from "../../Dialog/CommonDialog";
import { DIALOG_POSITIONS } from "@/interfaces/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { createPost, getPresignedURL, uploadToCloudinary } from "@/apicalls/postsApiCalls";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const PostForm = () => {
  const [openPostForm, setOpenPostForm] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<string | null>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {user} = useAuth()

  const reader = new FileReader();

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const firstItem = items[0]

      if (firstItem.type.indexOf("image") !== -1) {
        const blob = firstItem.getAsFile();
        if (blob) {
          // const reader = new FileReader();
          reader.onload = (e: any) => {
            if (e.target?.result) {
              setImages(e.target.result);
            }
          };
          reader.readAsDataURL(blob);
        }
      }
  
  };

  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(null)
    const files = e.target.files;
    if (files) {
      const firstFile = files[0]
        reader.onload = (e: any) => {
          if (e.target?.result) {
            setImages(e.target.result);
          }
        };
        reader.readAsDataURL(firstFile);

    }
  };

  const cleanup = () =>{
    setImages(null)
    setContent("")
  }

  const handleSavePost = async () => {
    const payload = {image_url:"",description:content,userId:user?.id,username:user?.username,fullname:user?.fullname}

    if(images){
      // get presigned url to upload image in cloudinary
      const result = await getPresignedURL()
      if (result.error){
        console.log("Something went wrong while getting presignedURL.")
        return
      }
      const formData = new FormData()
      formData.append("file",images)
  
      // upload image in cloudinary
      const response = await uploadToCloudinary(result.presignedUrl,formData)
      if(response.error){
        console.log("Something went wrong while uploading image.")
        return
      }

      payload.image_url = response.data?.url
    }

    // call create post api
    const res = await createPost(payload)
    if (res.error){
      console.log("Something went wrong while creating post.")
      return
    }

    cleanup();
    setOpenPostForm(false);

    toast({
      title: "Post Created Successfully.",
      className: "bg-green-500 text-white border-none"
    })
    
  };

  const formHeader = (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setOpenPostForm(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p
        // onClick={handleSavePost}
        className="text-blue-600 cursor-pointer font-semibold pr-2"
      >
        Drafts
      </p>
    </div>
  );
  const formBody = (
    <div>
      <div className="m-4">
        {images && (
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="relative">
              <Image
                src={images}
                alt={`Attached image`}
                width={80}
                height={80}
                className="rounded-md object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 rounded-full bg-black/50 hover:bg-gray-500/70"
                onClick={() => setImages(null)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-4 p-4">
        <Avatar>
          <AvatarImage src={user?.avatar_url} />
          <AvatarFallback>{user?.fullname[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="What is happening?!"
            className="min-h-[150px] resize-none border-0 text-xl focus-visible:ring-0"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handlePaste}
          />
        </div>
      </div>
    </div>
  );

  const formFooter = (
    <div className="flex w-full items-center justify-between border-t p-4">
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-500"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-5 w-5" />
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
          />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-500"
        >
          <Film className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-500"
        >
          <BarChart2 className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-500"
        >
          <Smile className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-500"
        >
          <Calendar className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-blue-500"
        >
          <MapPin className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <Button
          onClick={handleSavePost}
          className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          disabled={!content && !images}
        >
          Post
        </Button>
      </div>
    </div>
  );
  return (
    <div>
      <Button
        className="mt-4 rounded-full bg-white text-black hover:bg-gray-200 lg:p-3 xl:px-4 xl:py-3 xl:w-[200px]"
        onClick={() => {cleanup();setOpenPostForm(true)}}
      >
        <PenSquare className="h-6 w-6 lg:h-7 lg:w-7 xl:hidden" />
        <span className="hidden xl:inline-block">Post</span>
      </Button>
      <CommonDialog
        position={DIALOG_POSITIONS.TOP}
        open={openPostForm}
        onClose={() => setOpenPostForm(false)}
        header={formHeader}
        body={formBody}
        footer={formFooter}
      />
    </div>
  );
};

export default PostForm;
