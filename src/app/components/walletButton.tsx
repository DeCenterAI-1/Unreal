"use client";

import { createWallet, inAppWallet } from "thirdweb/wallets";
import { torusMainnet, torusTestnet } from "$/constants/chains";
import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import {
  bsc,
  bscTestnet,
  mainnet,
  polygon,
  polygonAmoy,
  sepolia,
} from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID as string,
});

const chains =
  process.env.NODE_ENV === "development"
    ? [
        torusTestnet,
        torusMainnet,
        mainnet,
        bsc,
        polygon,
        bscTestnet,
        polygonAmoy,
        sepolia,
      ]
    : [torusMainnet, mainnet, bsc, polygon];

const metadata = {
  name: "unreal",
  url: "https://unreal.art",
  description: "An ai media agent",
};

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "apple", "email", "passkey"],
    },
  }),
  createWallet("walletConnect"),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
];

const WalletButton: React.FC = () => {
  return (
    <ConnectButton
      theme={"dark"}
      appMetadata={metadata}
      client={client}
      wallets={wallets}
      chains={chains}
    />
  );
};

export default WalletButton;
