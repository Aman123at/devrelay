import { ITab } from "@/interfaces/interfaces";
import { ITabNavigatorProps } from "@/interfaces/propsInterfaces";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect } from "react";

const TabNavigator = ({
  tabData,
  activeTab,
  fromPage,
  routing = true,
  selectedTab,
  setSelectedTab,
}: ITabNavigatorProps) => {
  const getTabButton = (tab: ITab) => {
    if (routing) {
      return (
        <Link key={tab.value} href={`/pages/${fromPage}/${tab.value}`}>
          <button
            key={tab.value}
            className={cn(
              "w-max px-4 py-4 text-sm font-medium transition-colors relative",
              "hover:bg-accent/5",
              activeTab === tab.value
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
            )}
          </button>
        </Link>
      );
    } else {
      return (
        <button
          key={tab.value}
          className={cn(
            "w-max px-4 py-4 text-sm font-medium transition-colors relative",
            "hover:bg-accent/5",
            activeTab === tab.value
              ? "text-foreground"
              : "text-muted-foreground"
          )}
          onClick={() => setSelectedTab && setSelectedTab(tab)}
        >
          {tab.label}
          {selectedTab?.value === tab.value && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded-full" />
          )}
        </button>
      );
    }
  };
  return (
    <div className="relative flex flex-col">
      <div className="flex overflow-x-auto scrollbar-hide">
        <div className="flex ">
          {tabData.map((tab: ITab) => getTabButton(tab))}
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default TabNavigator;
