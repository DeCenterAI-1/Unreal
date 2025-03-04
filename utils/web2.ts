import { ethers } from "ethers";

// Function to generate Ethereum wallet
export const generateEthereumWallet = (): WalletObject => {
  // Generate Ethereum Wallet using ethers.js
  const wallet = ethers.Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    publicKey: wallet.publicKey,
  };
};

// returns a range of numbers to be used for pagination.
export function getRange(page: number, limit: number) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}

export function isValidFileName(name: string): boolean {
  // Basic validation: empty strings are not allowed
  if (!name) return false;

  // Check if it's just a dot (hidden files/folders)
  if (name === ".") return false;

  // Check if it starts with a dot (hidden files/folders)
  if (name.startsWith(".")) {
    // Hidden files/folders are allowed, but we should check if they're valid after the dot
    const rest = name.slice(1);
    return rest.length > 0 && isValidFileName(rest);
  }

  // // Check if it contains invalid characters
  // const invalidChars = /[\/*?:<>|\\]/;
  // if (invalidChars.test(name)) return false;

  // Check if it exceeds maximum length
  const maxNameLength = 255; // Windows limit
  if (name.length > maxNameLength) return false;

  // If we pass all checks, it's a valid file/folder name
  return true;
}

export function isHighQualityImage(filename: string): boolean {
  if (!isValidFileName(filename)) {
    return false;
  }
  // const lowQExt = ["webp", "svg", "ico"];
  const highQExt = ["jpeg", "jpg", "png"];

  return highQExt.includes(filename.toLowerCase().split(".").pop() || "");
}

export function truncateText(
  text: string | undefined | null,
  wordLimit: number = 10
): string {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
}

export const getNotificationMessage = (
  type: string,
  senderName: string | null | undefined
) => {
  switch (type) {
    case "like":
      return `${senderName} liked your post!`;
    case "comment":
      return `${senderName} commented on your post!`;
    case "share":
      return `${senderName} just shared your post! Your content is reaching more people.`;
    case "follow":
      return `${senderName} followed you!`;
    default:
      return "You have a new notification!";
  }
};

export function formatDate(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getImageResolution(imageUrl: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      resolve(`${img.width} × ${img.height} `);
    };
    img.onerror = (err) => reject(err);
  });
}

export function downloadImage(imageUrl: string, fileName?: string) {
  const uniqueId = Date.now(); // Unique timestamp
  const defaultFileName = `downloaded-image-${uniqueId}.jpg`; //  unique filename

  fetch(imageUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || defaultFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("Error downloading image:", error));
}

export const formatMoney = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export function splitName(fullName: string) {
  let parts = fullName.trim().split(" ");
  let firstName = parts[0];
  let lastName = parts.slice(1).join(" "); // Handles cases with middle names
  return { firstName, lastName };
}
