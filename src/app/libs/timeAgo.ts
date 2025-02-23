import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const timeAgo = (timestamp: string | number | Date | undefined) => {
  if (!timestamp) return;
  return dayjs(timestamp).fromNow();
};
