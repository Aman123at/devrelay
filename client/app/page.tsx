"use client";
import Feed from "./custom-components/Feed";
import TabNavigator from "./custom-components/Navbar/TabNavigator";
import { feedTabs, POST_API_BASE_URL } from "@/constants/constants";
import CommonPageLayout from "./custom-components/Layout/CommonLayout";
import { fetchPosts } from "@/apicalls/postsApiCalls";
import { PAGES } from "@/interfaces/enums";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()
  const { user } = useAuth();
  useEffect(()=>{
    if (user === null) {
      router.replace("/pages/auth/login");
    }
  },[user])
  return (
    <CommonPageLayout
      pageHeader={
        <TabNavigator
          fromPage={PAGES.FEED}
          activeTab="recommended"
          tabData={feedTabs}
        />
      }
      pageBody={
        <Feed
          fetchApiFn={(params: any) =>
            fetchPosts(`${POST_API_BASE_URL}/all`, { ...params })
          }
          queryKey="posts"
        />
      }
    />
  );
}
