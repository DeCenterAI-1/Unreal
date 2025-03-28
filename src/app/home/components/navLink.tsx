"use client";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, memo, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import OptimizedImage from "@/app/components/OptimizedImage";

import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  text: string;
  icon: "dashboard" | "notification" | "creations" | "profile" | "menu";
}

function NavLink({ href, text, icon }: NavLinkProps) {
  const [hover, setHover] = useState(false);
  const { user, loading } = useUser();
  const pathname = usePathname();

  // Determine active state based on pathname
  const active = useMemo(() => pathname === href, [pathname, href]);

  // Memoized color to avoid recalculation
  const iconColor = useMemo(() => {
    if (active) {
      return "#F5F5F5";
    } else if (hover) {
      return "#F5F5F5";
    } else {
      return "#5D5D5D";
    }
  }, [active, hover]);

  // Memoize SVG components to avoid unnecessary re-renders
  const iconSvg = useMemo(() => {
    switch (icon) {
      case "dashboard":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="will-change-[fill] transition-[fill] duration-150"
          >
            <path
              d="M11.25 5.25V9.75C11.25 10.1478 11.092 10.5294 10.8107 10.8107C10.5294 11.092 10.1478 11.25 9.75 11.25H5.25C4.85218 11.25 4.47064 11.092 4.18934 10.8107C3.90804 10.5294 3.75 10.1478 3.75 9.75V5.25C3.75 4.85218 3.90804 4.47064 4.18934 4.18934C4.47064 3.90804 4.85218 3.75 5.25 3.75H9.75C10.1478 3.75 10.5294 3.90804 10.8107 4.18934C11.092 4.47064 11.25 4.85218 11.25 5.25ZM18.75 3.75H14.25C13.8522 3.75 13.4706 3.90804 13.1893 4.18934C12.908 4.47064 12.75 4.85218 12.75 5.25V9.75C12.75 10.1478 12.908 10.5294 13.1893 10.8107C13.4706 11.092 13.8522 11.25 14.25 11.25H18.75C19.1478 11.25 19.5294 11.092 19.8107 10.8107C20.092 10.5294 20.25 10.1478 20.25 9.75V5.25C20.25 4.85218 20.092 4.47064 19.8107 4.18934C19.5294 3.90804 19.1478 3.75 18.75 3.75ZM9.75 12.75H5.25C4.85218 12.75 4.47064 12.908 4.18934 13.1893C3.90804 13.4706 3.75 13.8522 3.75 14.25V18.75C3.75 19.1478 3.90804 19.5294 4.18934 19.8107C4.47064 20.092 4.85218 20.25 5.25 20.25H9.75C10.1478 20.25 10.5294 20.092 10.8107 19.8107C11.092 19.5294 11.25 19.1478 11.25 18.75V14.25C11.25 13.8522 11.092 13.4706 10.8107 13.1893C10.5294 12.908 10.1478 12.75 9.75 12.75ZM18.75 12.75H14.25C13.8522 12.75 13.4706 12.908 13.1893 13.1893C12.908 13.4706 12.75 13.8522 12.75 14.25V18.75C12.75 19.1478 12.908 19.5294 13.1893 19.8107C13.4706 20.092 13.8522 20.25 14.25 20.25H18.75C19.1478 20.25 19.5294 20.092 19.8107 19.8107C20.092 19.5294 20.25 19.1478 20.25 18.75V14.25C20.25 13.8522 20.092 13.4706 19.8107 13.1893C19.5294 12.908 19.1478 12.75 18.75 12.75Z"
              fill={iconColor}
            />
          </svg>
        );
      case "notification":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="will-change-[fill] transition-[fill] duration-150"
          >
            <path
              d="M21 6.66565C20.8235 6.75707 20.6178 6.77465 20.4283 6.71453C20.2388 6.65441 20.0809 6.5215 19.9894 6.34502C19.2735 4.93079 18.1899 3.73549 16.8525 2.88471C16.7692 2.83214 16.697 2.76367 16.6401 2.6832C16.5832 2.60274 16.5427 2.51186 16.521 2.41575C16.4992 2.31964 16.4966 2.22019 16.5133 2.12307C16.5299 2.02594 16.5656 1.93306 16.6181 1.84971C16.6707 1.76636 16.7392 1.69418 16.8196 1.6373C16.9001 1.58041 16.991 1.53993 17.0871 1.51817C17.1832 1.4964 17.2827 1.49378 17.3798 1.51045C17.4769 1.52713 17.5698 1.56276 17.6531 1.61533C19.2118 2.61334 20.4775 4.00742 21.3206 5.65502C21.4121 5.83157 21.4296 6.0372 21.3695 6.2267C21.3094 6.41621 21.1765 6.57409 21 6.66565ZM3.34783 6.75002C3.48523 6.74996 3.61998 6.71216 3.73736 6.64074C3.85474 6.56932 3.95025 6.46702 4.01346 6.34502C4.72933 4.93079 5.81291 3.73549 7.15033 2.88471C7.31866 2.77854 7.43792 2.60985 7.48187 2.41575C7.52583 2.22165 7.49087 2.01804 7.38471 1.84971C7.27854 1.68138 7.10985 1.56212 6.91575 1.51817C6.72165 1.47421 6.51804 1.50916 6.34971 1.61533C4.79102 2.61334 3.52537 4.00742 2.68221 5.65502C2.62299 5.76932 2.59419 5.89694 2.59858 6.02559C2.60297 6.15424 2.6404 6.2796 2.70726 6.3896C2.77413 6.4996 2.86818 6.59053 2.98037 6.65366C3.09256 6.71678 3.2191 6.74997 3.34783 6.75002ZM20.7947 16.4944C20.9276 16.7222 20.998 16.9811 20.9989 17.2449C20.9998 17.5086 20.9312 17.768 20.7999 17.9967C20.6686 18.2255 20.4793 18.4156 20.251 18.5478C20.0228 18.6801 19.7638 18.7498 19.5 18.75H15.675C15.5029 19.5977 15.043 20.3599 14.3732 20.9073C13.7035 21.4547 12.865 21.7538 12 21.7538C11.135 21.7538 10.2966 21.4547 9.62682 20.9073C8.95707 20.3599 8.49715 19.5977 8.32502 18.75H4.50002C4.23641 18.7495 3.9776 18.6795 3.74965 18.5471C3.5217 18.4147 3.33266 18.2246 3.20158 17.9959C3.0705 17.7672 3.002 17.508 3.00299 17.2444C3.00398 16.9808 3.07441 16.7221 3.20721 16.4944C4.05189 15.0366 4.50002 12.9638 4.50002 10.5C4.50002 8.5109 5.29019 6.60324 6.69672 5.19672C8.10324 3.7902 10.0109 3.00002 12 3.00002C13.9891 3.00002 15.8968 3.7902 17.3033 5.19672C18.7098 6.60324 19.5 8.5109 19.5 10.5C19.5 12.9628 19.9481 15.0356 20.7947 16.4944ZM14.1206 18.75H9.87939C10.0348 19.1882 10.3221 19.5675 10.7018 19.8358C11.0816 20.104 11.5351 20.2481 12 20.2481C12.465 20.2481 12.9185 20.104 13.2982 19.8358C13.6779 19.5675 13.9653 19.1882 14.1206 18.75ZM19.5 17.25C18.5025 15.5372 18 13.2666 18 10.5C18 8.90872 17.3679 7.3826 16.2427 6.25738C15.1174 5.13216 13.5913 4.50002 12 4.50002C10.4087 4.50002 8.8826 5.13216 7.75738 6.25738C6.63216 7.3826 6.00002 8.90872 6.00002 10.5C6.00002 13.2675 5.49564 15.5381 4.50002 17.25H19.5Z"
              fill={iconColor}
            />
          </svg>
        );
      case "creations":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="will-change-[fill] transition-[fill] duration-150"
          >
            <path
              d="M21.5306 5.46935L18.5306 2.46935C18.461 2.39962 18.3783 2.3443 18.2872 2.30656C18.1962 2.26882 18.0986 2.24939 18 2.24939C17.9014 2.24939 17.8038 2.26882 17.7128 2.30656C17.6217 2.3443 17.539 2.39962 17.4694 2.46935L8.46937 11.4694C8.39975 11.5391 8.34454 11.6218 8.3069 11.7128C8.26926 11.8039 8.24992 11.9015 8.25 12V15C8.25 15.1989 8.32902 15.3897 8.46967 15.5303C8.61032 15.671 8.80109 15.75 9 15.75H12C12.0985 15.7501 12.1961 15.7307 12.2871 15.6931C12.3782 15.6554 12.4609 15.6002 12.5306 15.5306L21.5306 6.53061C21.6004 6.46095 21.6557 6.37823 21.6934 6.28718C21.7312 6.19614 21.7506 6.09854 21.7506 5.99998C21.7506 5.90142 21.7312 5.80382 21.6934 5.71277C21.6557 5.62173 21.6004 5.53901 21.5306 5.46935ZM11.6897 14.25H9.75V12.3103L15.75 6.31029L17.6897 8.24998L11.6897 14.25ZM18.75 7.18967L16.8103 5.24998L18 4.06029L19.9397 5.99998L18.75 7.18967ZM21 11.25V19.5C21 19.8978 20.842 20.2793 20.5607 20.5606C20.2794 20.8419 19.8978 21 19.5 21H4.5C4.10218 21 3.72064 20.8419 3.43934 20.5606C3.15804 20.2793 3 19.8978 3 19.5V4.49998C3 4.10215 3.15804 3.72062 3.43934 3.43932C3.72064 3.15801 4.10218 2.99998 4.5 2.99998H12.75C12.9489 2.99998 13.1397 3.079 13.2803 3.21965C13.421 3.3603 13.5 3.55107 13.5 3.74998C13.5 3.94889 13.421 4.13966 13.2803 4.28031C13.1397 4.42096 12.9489 4.49998 12.75 4.49998H4.5V19.5H19.5V11.25C19.5 11.0511 19.579 10.8603 19.7197 10.7197C19.8603 10.579 20.0511 10.5 20.25 10.5C20.4489 10.5 20.6397 10.579 20.7803 10.7197C20.921 10.8603 21 11.0511 21 11.25Z"
              fill={iconColor}
            />
          </svg>
        );
      case "profile":
        return (
          <>
            {!loading ? (
              <div className="w-8 h-8 rounded-full overflow-hidden will-change-transform">
                <OptimizedImage
                  src={user?.avatar_url || "/profile.jpg"}
                  isProfile={true}
                  alt="User profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                  trackPerformance={true}
                  imageName="nav-profile-avatar"
                />
              </div>
            ) : (
              <div className="w-8 h-8">
                <Skeleton
                  height="100%"
                  width="100%"
                  borderRadius="50%"
                  baseColor="#1a1a1a"
                  highlightColor="#333"
                />
              </div>
            )}
          </>
        );
      case "menu":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="will-change-[fill] transition-[fill] duration-150"
          >
            <path
              d="M21 12C21 12.1989 20.921 12.3897 20.7803 12.5303C20.6397 12.671 20.4489 12.75 20.25 12.75H3.75C3.55109 12.75 3.36032 12.671 3.21967 12.5303C3.07902 12.3897 3 12.1989 3 12C3 11.8011 3.07902 11.6103 3.21967 11.4697C3.36032 11.329 3.55109 11.25 3.75 11.25H20.25C20.4489 11.25 20.6397 11.329 20.7803 11.4697C20.921 11.6103 21 11.8011 21 12ZM3.75 6.75H20.25C20.4489 6.75 20.6397 6.67098 20.7803 6.53033C20.921 6.38968 21 6.19891 21 6C21 5.80109 20.921 5.61032 20.7803 5.46967C20.6397 5.32902 20.4489 5.25 20.25 5.25H3.75C3.55109 5.25 3.36032 5.32902 3.21967 5.46967C3.07902 5.61032 3 5.80109 3 6C3 6.19891 3.07902 6.38968 3.21967 6.53033C3.36032 6.67098 3.55109 6.75 3.75 6.75ZM20.25 17.25H3.75C3.55109 17.25 3.36032 17.329 3.21967 17.4697C3.07902 17.6103 3 17.8011 3 18C3 18.1989 3.07902 18.3897 3.21967 18.5303C3.36032 18.671 3.55109 18.75 3.75 18.75H20.25C20.4489 18.75 20.6397 18.671 20.7803 18.5303C20.921 18.3897 21 18.1989 21 18C21 17.8011 20.921 17.6103 20.7803 17.4697C20.6397 17.329 20.4489 17.25 20.25 17.25Z"
              fill={iconColor}
            />
          </svg>
        );
      default:
        throw new Error("Invalid icon");
    }
  }, [icon, iconColor, user, loading]);

  return (
    <Link
      className="flex md:p-2 md:my-5 flex-col items-center justify-center select-none"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      href={href}
      prefetch={href === "/home" || href === "/home/creations"}
    >
      <div className="h-8 flex items-center justify-center">{iconSvg}</div>
      <p
        style={{ color: iconColor }}
        className="text-xs md:text-base text-center m-1 transition-colors duration-150 min-h-[1.25rem] will-change-[color]"
      >
        {text}
      </p>
    </Link>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(NavLink);
