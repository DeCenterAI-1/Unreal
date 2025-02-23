import { Notification as NotificationType } from "$/types/data.types";
import Image from "next/image";
import { timeAgo } from "../libs/timeAgo";
import useAuthorImage from "@/hooks/useAuthorImage";
import useAuthorUsername from "@/hooks/useAuthorUserName";
import usePost from "@/hooks/usePost";
import { getNotificationMessage } from "$/utils";
import { getImage } from "../home/formattedPhotos";

interface NotificationProps {
  notification: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const { data: image } = useAuthorImage(notification?.sender_id);
  const { data: username } = useAuthorUsername(notification?.sender_id);
  const { data: post } = usePost(notification?.post_id);

  return (
    <div className="border-primary-8 border-[1px] flex items-center bg-primary-12 h-28 my-4 rounded-[20px] p-3">
      <div className="flex gap-2 justify-between items-center  w-full">
        <div className="w-[80%] ">
          <p className="text-[10px] text-primary-7">
            {timeAgo(notification?.created_at)}
          </p>

          <div className="flex gap-2 mt-1 w-ful">
            <div className="basis-10 ">
              <Image
                src={image || "/icons/dummy-profile.png"}
                width={36}
                height={36}
                alt="profile"
                className="rounded-full"
              />
            </div>

            <div className=" ">
              <p className="text-primary-4 text-md font-medium">{username}</p>
              <p className="text-primary-6 text-sm">
                {getNotificationMessage(notification.type, username)}
              </p>
            </div>
          </div>
        </div>

        <div className="basis-20  flex items-center w-[20%] ">
          <Image
            src={
              Array.isArray(post?.ipfsImages) &&
              post.ipfsImages.length > 0 &&
              typeof post.ipfsImages[0] === "object" &&
              post.ipfsImages[0] !== null &&
              "hash" in post.ipfsImages[0] &&
              "fileNames" in post.ipfsImages[0] &&
              Array.isArray(post.ipfsImages[0].fileNames) &&
              post.ipfsImages[0].fileNames.length > 0
                ? getImage(
                    post.ipfsImages[0].hash as string,
                    post.ipfsImages[0].fileNames[0] as string,
                  )
                : "/dummy/alien-girl.png"
            }
            width={70}
            height={70}
            alt="picture"
          />
        </div>
      </div>
    </div>
  );
};

export default Notification;
