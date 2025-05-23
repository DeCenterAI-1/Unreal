"use client";
import {
  MasonryPhotoAlbum,
  RenderImageContext,
  RenderImageProps,
  RenderPhotoContext,
} from "react-photo-album";
import "react-photo-album/masonry.css";
import { useEffect, useState } from "react";
import { MD_BREAKPOINT } from "@/app/libs/constants";
//import { ChatIcon, HeartFillIcon, HeartIcon, OptionMenuIcon } from "@/app/components/icons";
import PhotoOverlay, { ExtendedRenderPhotoContext } from "../photoOverlay";

import Image from "next/image";
import ImageView from "../imageView";
// import { usePostsQuery } from "@/hooks/usePostsQuery";
import { supabase } from "$/supabase/client";
import {
  getFollowingPosts,
  getPosts,
  getTopPosts,
} from "@/queries/post/getPosts";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "../InfiniteScroll";
import { formattedPhotos } from "../../formattedPhotos";
import { Post } from "$/types/data.types";
import { useSearchParams } from "next/navigation";
// import { getAuthorUserName } from "@/queries/post/getAuthorUserName";
import useAuthorUsername from "@/hooks/useAuthorUserName";
import useAuthorImage from "@/hooks/useAuthorImage";
import { useSearchPostsInfinite } from "@/hooks/useSearchPostsInfinite";
import { useGalleryStore } from "@/stores/galleryStore";
import OptimizedImage from "@/app/components/OptimizedImage";
import { capitalizeFirstAlpha } from "@/utils";

// Add renderNextImage function for lazy/eager loading
function renderNextImage(
  { alt = "", title, sizes }: RenderImageProps,
  { photo, width, height, index = 0 }: RenderImageContext,
) {
  // Use priority loading for the first 8 images (eagerly loaded)
  // This provides fast initial rendering for visible content
  const shouldPrioritize = index < 8;

  // Extract image name for tracking
  const imageName =
    typeof photo === "object" && photo !== null && "src" in photo
      ? String(photo.src).split("/").pop()?.split("?")[0] ||
        `search-img-${index}`
      : `search-img-${index}`;

  // Responsive size hints for optimal loading
  const responsiveSizes =
    sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <OptimizedImage
        fill
        src={photo}
        alt={alt || "Search result"}
        title={title}
        sizes={responsiveSizes}
        loading={shouldPrioritize ? "eager" : "lazy"}
        priority={shouldPrioritize}
        placeholder={"blurDataURL" in photo ? "blur" : undefined}
        trackPerformance={process.env.NODE_ENV === "development"}
        imageName={imageName}
      />
    </div>
  );
}

export default function SearchPhotoGallary({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const [imageIndex, setImageIndex] = useState(-1);
  const [columns, setColumns] = useState(
    window?.innerWidth < MD_BREAKPOINT ? 2 : 4,
  );

  // Use Zustand store for tab state
  const { initFromUrl } = useGalleryStore();

  // Sync with URL on initial load
  const searchParams = useSearchParams();
  useEffect(() => {
    const urlParam = searchParams.get("s");
    initFromUrl(urlParam);
  }, [searchParams, initFromUrl]);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPostsInfinite(searchTerm, 10);

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Ensure it runs only on the client

    const handleResize = () => {
      setColumns(window.innerWidth < MD_BREAKPOINT ? 2 : 4);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // ✅ Call initially to set correct columns

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageIndex = (context: RenderPhotoContext) => {
    setImageIndex(context.index);
  };

  if (isError) {
    return (
      <p className="wrapper">{"message" in error ? error.message : error}</p>
    );
  }

  if (!data || data.pages.length === 0) {
    return (
      <p>It looks like you haven&apos;t saved any books to this shelf yet.</p>
    );
  }

  return (
    <div className="w-full">
      <InfiniteScroll
        isLoadingInitial={isLoading}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}
        hasNextPage={hasNextPage}
      >
        <MasonryPhotoAlbum
          photos={formattedPhotos(data?.pages ?? [])}
          columns={columns}
          spacing={4}
          render={{
            extras: (_, context) => (
              <PhotoWithAuthor
                context={context as ExtendedRenderPhotoContext}
                handleImageIndex={handleImageIndex}
              />
            ),
            image: renderNextImage,
          }}
        />
      </InfiniteScroll>
      <ImageView
        photo={
          imageIndex > -1 && formattedPhotos(data?.pages ?? [])[imageIndex]
        }
        setImageIndex={setImageIndex}
      />
    </div>
  );
}

function PhotoWithAuthor({
  context,
  handleImageIndex,
}: {
  context: ExtendedRenderPhotoContext;
  handleImageIndex: (context: RenderPhotoContext) => void;
}) {
  const authorId = context.photo.author || ""; // Ensure it's always a string

  const { data: userName, isLoading: isLoading } = useAuthorUsername(authorId);
  const { data: image, isLoading: imageLoading } = useAuthorImage(authorId);
  return (
    <PhotoOverlay
      setImageIndex={() => handleImageIndex(context)}
      context={context}
    >
      <div className="absolute flex items-center gap-1 bottom-2 left-2">
        {!isLoading && !imageLoading && userName && (
          <>
            <div className="rounded-full">
              {image ? (
                <OptimizedImage
                  className="rounded-full drop-shadow-lg"
                  src={image}
                  width={24}
                  height={24}
                  alt={`${userName}'s profile picture`}
                  trackPerformance={true}
                  imageName={`profile-${authorId}`}
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full" /> // Fallback avatar
              )}
            </div>
            <p className="font-semibold text-sm drop-shadow-lg">
              {capitalizeFirstAlpha(userName)}
            </p>
          </>
        )}
      </div>
    </PhotoOverlay>
  );
}
