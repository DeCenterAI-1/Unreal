"use client";
import { ColumnsPhotoAlbum, RenderPhotoContext } from "react-photo-album";
import "react-photo-album/columns.css";
import { useEffect, useState } from "react";
import { MD_BREAKPOINT } from "@/app/libs/constants";
import dummyPhotos, { dummyPhotos2 } from "../../dummyPhotos";
//import { ChatIcon, HeartFillIcon, HeartIcon, OptionMenuIcon } from "@/app/components/icons";
import PhotoOverlay from "../../components/photoOverlay";
// import { getPosts } from "$/queries/post/getPosts";
// import { supabase } from "$/supabase/client";
import { usePostsQuery } from "@/hooks/usePostsQuery";
import Image from "next/image";
import ImageView from "../../components/imageView";
import { OptionMenuIcon } from "@/app/components/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostsByUser } from "$/queries/post/getPostsByUser";
import { formattedPhotos } from "../../formattedPhotos";
import { supabase } from "$/supabase/client";
import InfiniteScroll from "../../components/InfiniteScroll";
import NoItemFound from "./NoItemFound";
import { TabText } from "./Tabs";
// import { useQuery } from "@tanstack/react-query";



interface TabProps {
  title: TabText;
  content: string;
  subContent: string;
}

export default function PhotoGridTwo({title, content, subContent} : TabProps) {

  const [imageIndex, setImageIndex] = useState(-1)
  const [columns, setColumns] = useState(
    window?.innerWidth < MD_BREAKPOINT ? 2 : 4,
  );

  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  // const { data: posts } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: () => getPosts(supabase),
  // });

  const {
    isLoading,
    data,
    isFetchingNextPage,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["creation_posts"],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getPostsByUser(supabase, pageParam);

      return {
        data: result ?? [],
        nextCursor: result.length > 0 ? pageParam + 1 : undefined, // ✅ Stop pagination if no data
      };
    },
    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (!lastPage?.data || !Array.isArray(lastPage.data)) {
        return undefined;
      }

      if (lastPage.data.length === 0) {
        return undefined;
      }

      return lastPage.nextCursor; // ✅ Correctly use the cursor for pagination
    },
  });

  console.log({data})

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
    setImageIndex(context.index)
  }

  const photos = dummyPhotos2 //formattedPhotos(data?.pages ?? [])

  return (
    <>
      <InfiniteScroll
        isLoadingIntial={isLoading || isFetching}
        isLoadingMore={isFetchingNextPage}
        loadMore={() => hasNextPage && fetchNextPage()}>
        <ColumnsPhotoAlbum
          photos={photos}
          columns={columns}
          spacing={2}
          render={{
            extras: (_, context) => (
            <PhotoOverlay setImageIndex={() => handleImageIndex(context)}> 
              <>
          
                <div className="absolute top-0 flex justify-between text-primary-1 text-sm picture-gradient w-full h-12 items-center px-3">
                  <p>36s</p> 
                  <button>
                    <OptionMenuIcon color="#FFFFFF" />
                  </button>
                </div>

                <p className="absolute bottom-0 left-0 text-left text-primary-1 text-sm picture-gradient h-14 p-3">
                  Pixar Fest at Disneyland sounds amazing! I need to see the new parades! 🎉🎈
                </p>
                  
              </>
            </PhotoOverlay>
            ),
          }}
        />
      </InfiniteScroll>

      { photos.length < 1 && <NoItemFound title={title} content={content} subContent={subContent}  /> }

      <ImageView photo={imageIndex > -1 && photos[imageIndex]} setImageIndex={setImageIndex} />
    </>
  );
}
