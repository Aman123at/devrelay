"use client";
import { fetchPosts } from '@/apicalls/postsApiCalls';
import Feed from '@/app/custom-components/Feed';
import CommonPageLayout from '@/app/custom-components/Layout/CommonLayout'
import BackButtonHeader from '@/app/custom-components/Navbar/Header';
import React from 'react'

const BookMark = () => {
  const pageHeader = (
    <BackButtonHeader
      content={
        <div>
          <h1 className="text-xl font-bold">Bookmarks</h1>
        </div>
      }
    />
  );
  return (
        <CommonPageLayout pageHeader={pageHeader} pageBody={<Feed fetchApi={fetchPosts} queryKey='bookmarks' />} />
  )
}

export default BookMark