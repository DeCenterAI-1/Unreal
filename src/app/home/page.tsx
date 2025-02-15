import GenerateInput from "./components/generateInput";
import TabBtn from "./components/tabBtn";
import dynamic from "next/dynamic";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPosts } from "$/queries/post/getPosts";
import { createClient } from "$/supabase/server";
import { Post } from "$/types/data.types";

const PhotoGallary = dynamic(() => import("./components/photoGallary"), {
  ssr: true,
});

export default async function Home() {
  const supabaseSSR = await createClient();
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 0 }: { pageParam: number }) => {
      // console.log("Prefetching page:", pageParam); // Debugging line

      const result = await getPosts(supabaseSSR, pageParam);
      return {
        data: result ?? [],
        nextCursor: result.length > 0 ? pageParam + 1 : undefined, // ✅ Handle pagination
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: Post[]; nextCursor?: number }) =>
      lastPage?.nextCursor ?? undefined,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="relative flex flex-col items-center background-color-primary-1 px-1 md:px-10 w-full">
        <div className="hidden md:flex flex-col justify-center items-center pt-5 w-full">
          <GenerateInput />
        </div>

        <div className="flex gap-x-2 items-center w-full h-10 mt-8 md:mt-0 mb-2">
          <TabBtn text="Search" />
          <TabBtn text="Explore" />
          <TabBtn text="Following" />
          <TabBtn text="Top" />
        </div>

        <div className="overflow-y-auto">
          <PhotoGallary />
        </div>
        
      </div>
    </HydrationBoundary>
  );
}
