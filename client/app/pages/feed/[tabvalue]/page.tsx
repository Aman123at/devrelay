"use client";
import { fetchPosts } from '@/apicalls/postsApiCalls';
import Feed from '@/app/custom-components/Feed';
import CommonPageLayout from '@/app/custom-components/Layout/CommonLayout';
import TabNavigator from '@/app/custom-components/Navbar/TabNavigator';
import { feedTabs } from '@/constants/constants';
import { FEED_TABS, PAGES } from '@/interfaces/enums';
import { ITab } from '@/interfaces/interfaces';
import { Params } from 'next/dist/server/request/params';
import { useRouter, useParams } from 'next/navigation'
import React from 'react'

const TabContentPage = () => {
    const router = useRouter()
    const {tabvalue} : Params = useParams()
    
    if (!tabvalue) {
      console.log("INVALID TAB VALUE")
      router.replace("/")
    }else{
      const feedTabValues : string[] = Object.values(FEED_TABS)
      const isTabPresentInEnum: boolean = feedTabValues.includes(tabvalue.toString())
      if (!isTabPresentInEnum){
        console.log("TAB VALUE IS NOT PRESENT IN ENUM")
        router.replace("/")
      }
    }

    const tab = feedTabs.find((t:ITab)=>t.value === tabvalue)
  return (
    <CommonPageLayout pageHeader={<TabNavigator fromPage={PAGES.FEED} activeTab={tabvalue ? tabvalue.toString() : ""} tabData={feedTabs} />} pageBody={<Feed fetchApiFn={(params:any)=>fetchPosts(tab!.fetchUrl,{...params})} queryKey="posts" />} />
  )
}

export default TabContentPage