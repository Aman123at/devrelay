import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const BackButtonHeader = ({ content }: { content: React.ReactNode }) => {
  const router = useRouter()
  return (
    <div className="flex items-center gap-6 p-4">
      <div onClick={()=>router.back()} className="rounded-full hover:bg-accent p-2 cursor-pointer">
        <ArrowLeft className="h-5 w-5" />
      </div>
      {content}
    </div>
  );
};

export default BackButtonHeader;
