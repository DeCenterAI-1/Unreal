"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useTransition, useCallback, useRef } from "react";
import { useGalleryStore, GalleryTab } from "@/stores/galleryStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTransitionState } from "@/hooks/useTransitionState";

interface NavBtnProps {
  text: "Explore" | "Following" | "Top" | "Search";
}

export default function TabBtn({ text }: NavBtnProps) {
  const [hover, setHover] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Add isPending state to improve perceived performance
  const [isPending, startTransition] = useTransition();
  const { markAsTabChange } = useTransitionState();

  // Get state from Zustand
  const {
    activeTab,
    setActiveTab,
    initFromUrl,
    isTabTransitioning,
    setIsTabTransitioning,
  } = useGalleryStore();

  // Sync store with URL on initial load
  useEffect(() => {
    const urlParam = searchParams.get("s");
    if (urlParam) {
      initFromUrl(urlParam);
    }
  }, [searchParams, initFromUrl]);

  // Determine if this tab is active
  const isActive = activeTab === text.toUpperCase();

  // Use a useRef to track previous active state for smoother transitions
  const wasActiveRef = useRef(isActive);

  // Track transition completion with optimized animation timing
  useEffect(() => {
    if (isTabTransitioning && isActive && !wasActiveRef.current) {
      // Tab has just become active - apply subtle highlight without animation
      const button = buttonRef.current;
      if (button) {
        // Set immediate styles without animation
        button.classList.add("tab-active");

        // Just mark the transition as complete after a very short delay
        setTimeout(() => {
          setIsTabTransitioning(false);
        }, 50);
      }
    }

    // Update the ref for next comparison
    wasActiveRef.current = isActive;
  }, [isActive, isTabTransitioning, setIsTabTransitioning]);

  let iconSvg = null;

  function getIconColor() {
    if (isActive) {
      return "#8F8F8F";
    } else if (hover) {
      return "#8F8F8F";
    } else {
      return "#5D5D5D";
    }
  }

  // Create URL object for smoother navigation
  const createTabUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("s", text.toLowerCase());
    return `${pathname}?${params.toString()}`;
  }, [pathname, searchParams, text]);

  // Handle tab click with optimized performance
  const handleTabClick = useCallback(() => {
    if (isActive || isPending) return; // Skip if already active or pending

    // Start the tab transition state
    setIsTabTransitioning(true);

    // Mark this as a tab change to avoid full page transition BEFORE any other updates
    markAsTabChange();

    // Update Zustand state first for immediate UI feedback
    setActiveTab(text.toUpperCase() as GalleryTab);

    // Use Next.js transition for smoother navigation - with zero animation
    startTransition(() => {
      // Update URL without triggering layout effects
      router.replace(createTabUrl(), {
        scroll: false,
      });
    });
  }, [
    isActive,
    isPending,
    router,
    createTabUrl,
    setActiveTab,
    markAsTabChange,
    startTransition,
    setIsTabTransitioning,
    text,
  ]);

  switch (text) {
    case "Explore":
      iconSvg = (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1.5C6.71442 1.5 5.45772 1.88122 4.3888 2.59545C3.31988 3.30968 2.48676 4.32484 1.99479 5.51256C1.50282 6.70028 1.37409 8.00721 1.6249 9.26809C1.8757 10.529 2.49477 11.6872 3.40381 12.5962C4.31285 13.5052 5.47104 14.1243 6.73192 14.3751C7.99279 14.6259 9.29973 14.4972 10.4874 14.0052C11.6752 13.5132 12.6903 12.6801 13.4046 11.6112C14.1188 10.5423 14.5 9.28558 14.5 8C14.4982 6.27665 13.8128 4.62441 12.5942 3.40582C11.3756 2.18722 9.72335 1.50182 8 1.5ZM8 13.5C6.91221 13.5 5.84884 13.1774 4.94437 12.5731C4.0399 11.9687 3.33495 11.1098 2.91867 10.1048C2.50238 9.09977 2.39347 7.9939 2.60568 6.927C2.8179 5.86011 3.34173 4.8801 4.11092 4.11091C4.8801 3.34172 5.86011 2.8179 6.92701 2.60568C7.9939 2.39346 9.09977 2.50238 10.1048 2.91866C11.1098 3.33494 11.9687 4.03989 12.5731 4.94436C13.1774 5.84883 13.5 6.9122 13.5 8C13.4983 9.45818 12.9184 10.8562 11.8873 11.8873C10.8562 12.9184 9.45819 13.4983 8 13.5ZM10.7763 4.5525L6.77625 6.5525C6.67955 6.60108 6.60108 6.67954 6.5525 6.77625L4.5525 10.7762C4.51434 10.8525 4.49632 10.9373 4.50015 11.0224C4.50398 11.1076 4.52953 11.1904 4.57437 11.2629C4.61922 11.3355 4.68186 11.3953 4.75636 11.4368C4.83086 11.4783 4.91473 11.5001 5 11.5C5.07762 11.4999 5.15418 11.4819 5.22375 11.4475L9.22375 9.4475C9.32046 9.39892 9.39893 9.32046 9.4475 9.22375L11.4475 5.22375C11.4947 5.12983 11.5111 5.02343 11.4943 4.91967C11.4776 4.8159 11.4286 4.72005 11.3543 4.64573C11.28 4.57141 11.1841 4.5224 11.0803 4.50566C10.9766 4.48893 10.8702 4.50531 10.7763 4.5525ZM8.625 8.625L6.11813 9.88188L7.375 7.375L9.88438 6.12063L8.625 8.625Z"
            fill={getIconColor()}
          />
        </svg>
      );
      break;
    case "Following":
      iconSvg = (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 8.50006C16 8.63267 15.9473 8.75984 15.8535 8.85361C15.7598 8.94738 15.6326 9.00006 15.5 9.00006H14.5V10.0001C14.5 10.1327 14.4473 10.2598 14.3535 10.3536C14.2598 10.4474 14.1326 10.5001 14 10.5001C13.8674 10.5001 13.7402 10.4474 13.6464 10.3536C13.5527 10.2598 13.5 10.1327 13.5 10.0001V9.00006H12.5C12.3674 9.00006 12.2402 8.94738 12.1464 8.85361C12.0527 8.75984 12 8.63267 12 8.50006C12 8.36745 12.0527 8.24027 12.1464 8.1465C12.2402 8.05274 12.3674 8.00006 12.5 8.00006H13.5V7.00006C13.5 6.86745 13.5527 6.74027 13.6464 6.6465C13.7402 6.55274 13.8674 6.50006 14 6.50006C14.1326 6.50006 14.2598 6.55274 14.3535 6.6465C14.4473 6.74027 14.5 6.86745 14.5 7.00006V8.00006H15.5C15.6326 8.00006 15.7598 8.05274 15.8535 8.1465C15.9473 8.24027 16 8.36745 16 8.50006ZM12.3831 12.1782C12.4685 12.2798 12.51 12.4112 12.4985 12.5434C12.487 12.6756 12.4235 12.7978 12.3219 12.8832C12.2203 12.9685 12.0889 13.0101 11.9567 12.9986C11.8245 12.9871 11.7022 12.9235 11.6169 12.8219C10.3594 11.3244 8.63062 10.5001 6.74999 10.5001C4.86937 10.5001 3.14062 11.3244 1.88312 12.8219C1.79775 12.9235 1.67555 12.9869 1.54339 12.9983C1.41124 13.0098 1.27996 12.9682 1.17843 12.8829C1.0769 12.7975 1.01344 12.6753 1.00201 12.5431C0.990586 12.411 1.03212 12.2797 1.11749 12.1782C2.05124 11.0669 3.21249 10.2776 4.50312 9.85506C3.71931 9.36687 3.11582 8.63669 2.78395 7.77498C2.45208 6.91327 2.4099 5.96692 2.66377 5.07909C2.91765 4.19127 3.45377 3.41029 4.19103 2.85429C4.9283 2.2983 5.82658 1.99756 6.74999 1.99756C7.6734 1.99756 8.57168 2.2983 9.30895 2.85429C10.0462 3.41029 10.5823 4.19127 10.8362 5.07909C11.0901 5.96692 11.0479 6.91327 10.716 7.77498C10.3842 8.63669 9.78068 9.36687 8.99687 9.85506C10.2875 10.2776 11.4487 11.0669 12.3831 12.1782ZM6.74999 9.50006C7.39278 9.50006 8.02113 9.30945 8.55559 8.95233C9.09005 8.59522 9.50661 8.08764 9.7526 7.49378C9.99858 6.89992 10.0629 6.24645 9.93754 5.61601C9.81214 4.98558 9.50261 4.40648 9.04809 3.95196C8.59357 3.49744 8.01447 3.18791 7.38403 3.06251C6.7536 2.9371 6.10013 3.00146 5.50627 3.24745C4.91241 3.49343 4.40483 3.91 4.04771 4.44446C3.6906 4.97891 3.49999 5.60727 3.49999 6.25006C3.50098 7.11171 3.84371 7.93778 4.45299 8.54706C5.06227 9.15634 5.88834 9.49907 6.74999 9.50006Z"
            fill={getIconColor()}
          />
        </svg>
      );
      break;
    case "Top":
      iconSvg = (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8538 8.64625C12.9002 8.6927 12.9371 8.74786 12.9622 8.80855C12.9873 8.86925 13.0003 8.9343 13.0003 9C13.0003 9.0657 12.9873 9.13075 12.9622 9.19145C12.9371 9.25214 12.9002 9.3073 12.8538 9.35375C12.8073 9.40021 12.7521 9.43706 12.6914 9.4622C12.6308 9.48734 12.5657 9.50028 12.5 9.50028C12.4343 9.50028 12.3692 9.48734 12.3086 9.4622C12.2479 9.43706 12.1927 9.40021 12.1462 9.35375L8.5 5.70687V14C8.5 14.1326 8.44732 14.2598 8.35355 14.3536C8.25979 14.4473 8.13261 14.5 8 14.5C7.86739 14.5 7.74021 14.4473 7.64645 14.3536C7.55268 14.2598 7.5 14.1326 7.5 14V5.70687L3.85375 9.35375C3.80729 9.40021 3.75214 9.43706 3.69145 9.4622C3.63075 9.48734 3.5657 9.50028 3.5 9.50028C3.4343 9.50028 3.36925 9.48734 3.30855 9.4622C3.24786 9.43706 3.19271 9.40021 3.14625 9.35375C3.09979 9.3073 3.06294 9.25214 3.0378 9.19145C3.01266 9.13075 2.99972 9.0657 2.99972 9C2.99972 8.9343 3.01266 8.86925 3.0378 8.80855C3.06294 8.74786 3.09979 8.6927 3.14625 8.64625L7.64625 4.14625C7.69269 4.09976 7.74783 4.06288 7.80853 4.03772C7.86923 4.01256 7.93429 3.99961 8 3.99961C8.06571 3.99961 8.13077 4.01256 8.19147 4.03772C8.25217 4.06288 8.30731 4.09976 8.35375 4.14625L12.8538 8.64625ZM13.5 2H2.5C2.36739 2 2.24021 2.05268 2.14645 2.14645C2.05268 2.24021 2 2.36739 2 2.5C2 2.63261 2.05268 2.75979 2.14645 2.85355C2.24021 2.94732 2.36739 3 2.5 3H13.5C13.6326 3 13.7598 2.94732 13.8536 2.85355C13.9473 2.75979 14 2.63261 14 2.5C14 2.36739 13.9473 2.24021 13.8536 2.14645C13.7598 2.05268 13.6326 2 13.5 2Z"
            fill={getIconColor()}
          />
        </svg>
      );
      break;
    case "Search":
      iconSvg = (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14.3536 13.6463L11.2243 10.5175C12.1313 9.42859 12.5836 8.03189 12.487 6.61798C12.3905 5.20407 11.7526 3.88181 10.706 2.92625C9.65938 1.9707 8.28468 1.45543 6.86784 1.48763C5.451 1.51983 4.10112 2.09702 3.09901 3.09913C2.0969 4.10125 1.51971 5.45113 1.48751 6.86796C1.45531 8.2848 1.97058 9.65951 2.92613 10.7061C3.88168 11.7527 5.20395 12.3906 6.61786 12.4872C8.03177 12.5837 9.42846 12.1314 10.5174 11.2244L13.6461 14.3538C13.6926 14.4002 13.7478 14.4371 13.8085 14.4622C13.8691 14.4874 13.9342 14.5003 13.9999 14.5003C14.0656 14.5003 14.1307 14.4874 14.1913 14.4622C14.252 14.4371 14.3072 14.4002 14.3536 14.3538C14.4001 14.3073 14.437 14.2522 14.4621 14.1915C14.4872 14.1308 14.5002 14.0657 14.5002 14C14.5002 13.9343 14.4872 13.8693 14.4621 13.8086C14.437 13.7479 14.4001 13.6927 14.3536 13.6463ZM2.4999 7.00002C2.4999 6.11 2.76382 5.23998 3.25829 4.49995C3.75275 3.75993 4.45556 3.18316 5.27782 2.84256C6.10009 2.50197 7.00489 2.41285 7.8778 2.58649C8.75072 2.76012 9.55254 3.1887 10.1819 3.81804C10.8112 4.44738 11.2398 5.2492 11.4134 6.12211C11.5871 6.99503 11.498 7.89983 11.1574 8.7221C10.8168 9.54436 10.24 10.2472 9.49996 10.7416C8.75994 11.2361 7.88991 11.5 6.9999 11.5C5.80683 11.4987 4.66301 11.0242 3.81938 10.1805C2.97575 9.33691 2.50122 8.19309 2.4999 7.00002Z"
            fill={getIconColor()}
          />
        </svg>
      );
      break;
    default:
      throw new Error("Invalid icon");
  }

  // Special handling for Search tab
  if (text === "Search") {
    return (
      <motion.button
        ref={buttonRef}
        className={`flex items-center p-2 rounded-full border-primary-9 border-[1px] ${
          hover || isActive ? "bg-primary-10" : ""
        } ${isActive ? "tab-active" : ""}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.1 }}
        onClick={handleTabClick}
      >
        <div>{iconSvg}</div>
      </motion.button>
    );
  }

  // Regular tabs with smoother transitions
  return (
    <motion.button
      ref={buttonRef}
      className={`relative flex items-center gap-2 rounded-full ${
        isActive ? "bg-primary-10" : ""
      } px-2 md:px-4 py-2 cursor-pointer hover:bg-primary-10 transition-colors duration-150 ${
        isActive ? "tab-active" : ""
      }`}
      onClick={handleTabClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      disabled={isPending}
    >
      {iconSvg}
      <span
        className={`${
          isActive ? "text-primary-7" : "text-primary-5"
        } font-poppins text-sm transition-colors duration-150 select-none`}
      >
        {text}
      </span>
    </motion.button>
  );
}
