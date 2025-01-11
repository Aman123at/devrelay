import React from "react";
import SideNav from "../../Navbar/SideNavbar";
import RightSideBar from "../../RightSidebar";
import TopNav from "../../Navbar/TopNavbar";
import { BottomNav } from "../../Navbar/BottomNavbar";
import { ICommonPageLayoutProps } from "@/interfaces/propsInterfaces";
import { Spinner } from "../../Loader/Spinner";

const CommonPageLayout = ({
  pageHeader,
  pageBody,
}: ICommonPageLayoutProps) => {
  return (
    <div className="2xl:flex 2xl:justify-center">
      <div className="mx-auto flex min-h-screen gap-0 lg:gap-4 px-0 lg:px-4">
        <header className="sticky top-0 z-50 hidden h-screen lg:flex lg:w-[88px] xl:w-[275px] shrink-0">
          <div className="flex h-full flex-col gap-4 py-4">
            <SideNav />
          </div>
        </header>
        <main className="flex-1 border-x lg:w-auto 2xl:w-[700px]">
          <TopNav headerContent={pageHeader} />
          {pageBody}
        </main>
        <aside className="sticky top-0 hidden h-screen w-[350px] shrink-0 py-4 xl:block">
          <RightSideBar />
        </aside>
      </div>
      <BottomNav />
      <Spinner />
    </div>
  );
};

export default CommonPageLayout;
