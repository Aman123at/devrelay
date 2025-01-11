"use client";
import { fetchPosts } from "@/apicalls/postsApiCalls";
import CommonDialog from "@/app/custom-components/Dialog/CommonDialog";
import Feed from "@/app/custom-components/Feed";
import CommonPageLayout from "@/app/custom-components/Layout/CommonLayout";
import BackButtonHeader from "@/app/custom-components/Navbar/Header";
import TabNavigator from "@/app/custom-components/Navbar/TabNavigator";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { profileTabs } from "@/constants/constants";
import { PAGES, PROFILE_TABS } from "@/interfaces/enums";
import { ITab } from "@/interfaces/interfaces";
import {
  BriefcaseBusiness,
  Calendar,
  ImagePlus,
  MapPin,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const Profile = () => {
  const pageHeader = (
    <BackButtonHeader
      content={
        <div>
          <h1 className="text-xl font-bold">Aman Tiwari</h1>
          <p className="text-sm text-muted-foreground">16 posts</p>
        </div>
      }
    />
  );

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState("/placeholder.svg");
  const [profilePhoto, setProfilePhoto] = useState("/placeholder.svg");

  const postTab = profileTabs.find(
    (tab: ITab) => tab.value === PROFILE_TABS.POSTS
  );

  const [selectedTab, setSelectedTab] = useState<ITab>(postTab!);

  const handleEditProfile = () => {
    setOpenDialog(false);
  };

  const getTabsContent = (tabValue: string) => {
    switch (tabValue) {
      case PROFILE_TABS.POSTS:
        return (
          <Feed
            queryKey="profile-posts"
            fetchApiFn={(params: any) =>
              fetchPosts(selectedTab.fetchUrl, { ...params })
            }
          />
        );
      default:
        return <></>;
    }
  };

  const dialogHeader = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setOpenDialog(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogTitle>Edit profile</DialogTitle>
      </div>
      <Button
        onClick={handleEditProfile}
        className="rounded-full bg-foreground text-background hover:bg-foreground/90"
      >
        Save
      </Button>
    </div>
  );

  const dialogBody = (
    <div>
      {/* Cover Photo */}
      <div className="relative h-[200px] bg-muted">
        <Image
          src={coverPhoto}
          alt="Cover photo"
          className="object-cover"
          fill
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
          <Label htmlFor="cover-photo" className="cursor-pointer">
            <ImagePlus className="h-8 w-8 text-white" />
          </Label>
          <Input
            id="cover-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setCoverPhoto(url);
              }
            }}
          />
        </div>
      </div>

      {/* Profile Photo */}
      <div className="relative -mt-16 ml-4 h-32 w-32">
        <div className="relative h-full w-full rounded-full border-4 border-background overflow-hidden">
          <Image
            src={profilePhoto}
            alt="Profile picture"
            className="object-cover"
            fill
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
          <Label htmlFor="profile-photo" className="cursor-pointer">
            <ImagePlus className="h-6 w-6 text-white" />
          </Label>
          <Input
            id="profile-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setProfilePhoto(url);
              }
            }}
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Aman Tiwari" maxLength={50} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            defaultValue="Software Engineer || Tech Explorer"
            maxLength={160}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            defaultValue="Software developer/Programmer/Software engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input id="website" type="url" placeholder="Add your website" />
        </div>
      </div>
    </div>
  );

  const pageBody = (
    <div>
      {/* Cover Image */}
      <div className="relative h-[200px]">
        <Image
          src="https://res.cloudinary.com/mycloud112233/image/upload/v1734712404/001f18e2-2792-43c7-b172-7894a93c2a00.jpg"
          alt="Cover photo"
          className="object-cover"
          fill
        />
      </div>

      {/* Profile Section */}
      <div className="relative px-4 pb-4">
        {/* Profile Picture */}
        <div className="absolute -top-20 left-4 h-40 w-40 rounded-full border-4 border-background overflow-hidden">
          <Image
            src="https://res.cloudinary.com/mycloud112233/image/upload/v1734712963/myfirstfile__f61fc860-5ad5-4343-a0db-7b96d9da5e8c.jpg"
            alt="Profile picture"
            className="object-cover"
            fill
          />
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end py-3">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOpenDialog(true)}
          >
            Edit profile
          </Button>
        </div>

        {/* Profile Info */}
        <div className="mt-6 ml-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Aman Tiwari</h2>
          </div>
          <p className="text-muted-foreground">@aman_tech_123</p>

          <p className="mt-4">Software Engineer || Tech Explorer</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BriefcaseBusiness className="h-4 w-4" />
              <span>Software developer/Programmer/Software engineer</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Joined May 2024</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-4 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Bilaspur</span>
          </div>

          <div className="mt-4 flex gap-4 text-sm">
            <div>
              <span className="font-bold">296</span>{" "}
              <span className="text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-bold">25</span>{" "}
              <span className="text-muted-foreground">Followers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="my-4">
        <TabNavigator
          fromPage={PAGES.PROFILE}
          routing={false}
          tabData={profileTabs}
          activeTab={PROFILE_TABS.POSTS}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
        {/* Tab Content */}
        {getTabsContent(selectedTab.value)}
      </div>

      <CommonDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        header={dialogHeader}
        body={dialogBody}
      />
    </div>
  );

  return <CommonPageLayout pageHeader={pageHeader} pageBody={pageBody} />;
};

export default Profile;
