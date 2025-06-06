"use client";
import { ReactNode, useState } from "react";
import {
  ChatIcon,
  HeartFillIcon,
  HeartIcon,
  OptionMenuIcon,
} from "@/app/components/icons";
import { Photo, RenderPhotoContext } from "react-photo-album";
import { formatNumber, truncateText } from "@/utils";
import { usePostLikes } from "@/hooks/usePostLikes";
import { supabase } from "$/supabase/client";
import { useLikePost } from "@/hooks/useLikePost";
import { useUser } from "@/hooks/useUser";
import { timeAgo } from "@/app/libs/timeAgo";
import { useComments, useRealtimeComments } from "@/hooks/useComments";
import ImageOptionMenu from "./imageOptionMenu";
import { useRouter } from "next/navigation";
import Link from "next/link";

export interface ExtendedRenderPhotoContext extends RenderPhotoContext {
  photo: Photo & {
    prompt: string;
    id: string;
    author: string;
    createdAt: string;
    caption?: string;
  };
}

interface PhotoOverlayProps {
  hideContent?: true;
  children: ReactNode;
  setImageIndex: () => void;
  context: ExtendedRenderPhotoContext;
  photo?: ReactNode;
  section?: string;
}

export default function PhotoOverlay({
  hideContent,
  children,
  setImageIndex,
  context,
  photo,
  section,
}: PhotoOverlayProps) {
  const router = useRouter();
  // console.log(context.photo.createdAt);
  const [hover, setHover] = useState(false);
  // const [like, setLike] = useState(false);
  const { userId } = useUser();
  const {
    likes,
    likesCount,
    isLoading: loadingLikes,
    hasUserLiked,
  } = usePostLikes(Number(context.photo.id), supabase);
  const { mutate: toggleLike } = useLikePost(
    Number(context.photo.id),
    userId,
    context.photo.author
  );

  const userHasLiked = likes?.some((like) => like.author === userId);

  // console.log(context.photo.createdAt);
  const handleCommentClick = () => {
    setImageIndex(); // or any specific value you want to pass
  };

  const { data: comments, isLoading: loadingComments } = useComments(
    context.photo.id
  );
  useRealtimeComments(context.photo.id);

  const handleView = () => {
    router.push("/home/photo/" + context.photo.id);
  };

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="absolute cursor-pointer top-0 left-0 w-full h-full flex flex-col text-primary-1 text-sm md:hover:bg-gray-900/50"
      >
        {hover && (
          <div className="relative hidden md:flex flex-col text-primary-1 justify-between px-4 py-3 h-full">
            {/* <Link href={`/home/photo/${context.photo.id}`}> */}
            <div
              onClick={handleView}
              className="absolute top-0 left-0 w-full h-full"
            >
              {" "}
              {photo}{" "}
            </div>
            {/* </Link> */}

            <div
              onClick={handleView}
              className="absolute top-0 left-0 w-full h-full cursor-pointer"
            ></div>
            {!hideContent ? (
              <div className="flex justify-between text-primary-1 text-sm z-20">
                <p>{timeAgo(context.photo.createdAt)}</p>
                <ImageOptionMenu
                  image={context.photo}
                  postId={context.photo.id}
                >
                  <OptionMenuIcon color="#FFFFFF" />
                </ImageOptionMenu>
              </div>
            ) : (
              <div> </div>
            )}

            {/* {!loadingLikes && !loadingComments && ( */}
            <div className="flex justify-center w-fit m-auto p-2 rounded-md hover:bg-black/30 gap-4 z-10">
              <button
                className="flex gap-1 items-center"
                onClick={() => toggleLike()}
              >
                {userHasLiked ? (
                  <HeartFillIcon color="#FFFFFF" />
                ) : (
                  <HeartIcon color="#FFFFFF" />
                )}
                <div className="min-w-[24px] text-center">
                  <p className={`transition-opacity duration-300 ${likes ? 'opacity-100' : 'opacity-0'}`}>
                    {likes ? formatNumber(likes.length) : '0'}
                  </p>
                </div>
              </button>

              <button
                className="flex gap-1 items-center"
                onClick={() => handleCommentClick()}
              >
                <ChatIcon color="#FFFFFF" />
                <div className="min-w-[24px] text-center">
                  <p className={`transition-opacity duration-300 ${comments ? 'opacity-100' : 'opacity-0'}`}>
                    {comments ? formatNumber(comments.length) : '0'}
                  </p>
                </div>
              </button>
            </div>
            {/* )} */}

            {!hideContent ? (
              <Link href={`/home/photo/${context.photo.id}`}>
                {" "}
                {/*Link is added to enable prefetch */}
                <p className="text-left text-primary-1 text-sm z-10">
                  {truncateText(context.photo.caption || context.photo.prompt)}
                </p>
              </Link>
            ) : (
              <p></p>
            )}
          </div>
        )}

        <div className="flex flex-col md:hidden h-full w-full justify-between items-end p-3">
          <div className="relative block mr-4">
            <div className="absolute">
              <div className="absolute z-20">
                <ImageOptionMenu
                  image={context.photo}
                  postId={context.photo.id}
                >
                  <OptionMenuIcon color="#FFFFFF" />
                </ImageOptionMenu>
              </div>
            </div>
          </div>

          <div
            className={`flex flex-col ${
              section == "photoGridTwo" ? "mb-12" : ""
            }`}
          >
            <div className="relative flex flex-col items-center">
              <button
                className="absolute flex flex-col items-center z-10"
                onClick={() => toggleLike()}
              >
                {userHasLiked ? (
                  <HeartFillIcon color="#FFFFFF" />
                ) : (
                  <HeartIcon color="#FFFFFF" />
                )}
              </button>
              <div className="h-6 mt-6 z-10 min-w-[24px] text-center">
                <p
                  className={`transition-opacity duration-300 ${
                    likes ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {likes ? formatNumber(likes.length) : "0"}
                </p>
              </div>
            </div>

            <div className="relative flex flex-col items-center ">
              <button
                className="absolute flex gap-1 items-center z-10"
                onClick={handleCommentClick}
              >
                <ChatIcon color="#FFFFFF" />
              </button>
              <div className="h-6 mt-6 z-10 min-w-[24px] text-center">
                <p
                  className={`transition-opacity duration-300 ${
                    comments ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {comments ? formatNumber(comments.length) : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          onClick={handleView}
          className="absolute hidden md:block w-full h-full"
        >
          {!hover && children}{" "}
        </div>

        <div onClick={handleView} className="absolute  md:hidden w-full h-full">
          {children}{" "}
        </div>
      </div>
    </>
  );
}
