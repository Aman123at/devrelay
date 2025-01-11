"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Bookmark, Home, Mail, User, Search, LogOut } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScroll } from "@/contexts/ScrollContext";
import PostForm from "../../Form/PostButtonWithForm";
import { useAuth } from "@/contexts/AuthContext";

const mainNav = [
  {
    title: "Home",
    href: "/",
    icon: Home,
  },
  {
    title: "Explore",
    href: "/explore",
    icon: Search,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: Mail,
  },
  {
    title: "Bookmarks",
    href: "/pages/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Profile",
    href: "/pages/profile",
    icon: User,
  },
];

export function SideNav() {
  const pathname = usePathname();
  const { setShouldScrollToTop } = useScroll();
  const { logoutFromUserContext } = useAuth();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      setShouldScrollToTop(true);
    }
  };
  const handleLogout = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    logoutFromUserContext();
  };

  return (
    <nav className="flex flex-col gap-1 px-2 lg:px-0">
      <p className="text-2xl font-bold my-2 ml-2">DevRelay</p>
      {mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-4 rounded-full p-3 text-lg transition-colors hover:bg-accent",
            pathname === item.href && "font-bold",
            "lg:justify-center xl:justify-start"
          )}
          onClick={item.title === "Home" ? handleHomeClick : undefined}
        >
          <item.icon
            className="h-7 w-7"
            strokeWidth={pathname === item.href ? 3 : 2}
          />
          <span className="inline-block lg:hidden xl:inline-block">
            {item.title}
          </span>
        </Link>
      ))}
      <div
        className="flex items-center gap-4 rounded-full p-3 text-lg hover:bg-accent cursor-pointer"
        onClick={handleLogout}
      >
        <LogOut className="h-7 w-7 text-red-800" />
        <span className="inline-block lg:hidden xl:inline-block text-red-800 font-semibold">
          Logout
        </span>
      </div>

      <PostForm />
    </nav>
  );
}

export default SideNav;
