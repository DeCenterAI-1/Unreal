import { Page, Post } from "$/types/data.types";
import { isHighQualityImage } from "$/utils";
import type { Photo } from "react-photo-album";

export interface ExtendedPhoto extends Photo {
  prompt?: string;
  author?: string;
  category?: string;
  cpu?: number;
  createdAt?: string;
  device?: string;
  isDraft?: boolean;
  isPinned?: boolean;
  isPrivate?: boolean;
  likeCount?: number;
  seed?: number;
  id: string;
}

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

// Function to fetch the image
export const getImage = (cid: string, fileName: string) => {
  try {
    let imageOptions = "";
    if (isHighQualityImage(fileName)) {
      imageOptions += "?h=300&w=300";
    }
    return (
      process.env.NEXT_PUBLIC_LIGHTHOUSE_GATE_WAY +
      cid +
      "/" +
      fileName +
      imageOptions
    );
  } catch (error) {
    console.error("Error fetching image:", error);
    return "/fallback.jpg"; //TODO: Provide a fallback image if fetch fails
  }
};

export const formattedPhotos = (pages: Page[]): ExtendedPhoto[] => {
  return pages
    .flatMap((page) =>
      page.data.map((post: Post) => {
        const image = post.ipfsImages?.[0]; // Assuming only one image per post

        if (!image || !image.hash || !image.fileNames?.[0]) return null;

        const assetHash = image.hash;
        const fileName = image.fileNames[0];

        const imageUrl = getImage(assetHash, fileName);

        return {
          id: post.id.toString(),
          src: imageUrl,
          key: post.id.toString(),
          alt: post.prompt,
          width: 1080,
          height: 720, // Adjust based on actual aspect ratio
          srcSet: breakpoints.map((breakpoint) => ({
            src: getImage(assetHash, fileName), // Ensure consistent source
            width: breakpoint,
            height: Math.round((720 / 1080) * breakpoint), // Maintain aspect ratio
          })),
          prompt: post.prompt,
          author: post.author,
          category: post.category,
          cpu: post.cpu,
          createdAt: post.createdAt,
          device: post.device,
          isDraft: post.isDraft,
          isPinned: post.isPinned,
          isPrivate: post.isPrivate,
          seed: post.seed,
        } as ExtendedPhoto;
      }),
    )
    .filter(Boolean) as ExtendedPhoto[];
};
