import { useEffect, useState } from "react";
import TabIcon from "./TabIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type TabText = "Public" | "Private" | "Liked" | "Pinned" | "Draft" | "User" | "Image";

export interface ITabs {
  hideDraft?: boolean;
  currentIndex: number;
  setCurrentIndex: (value: number) => void;
}

export default function Tabs({
  hideDraft,
  currentIndex,
  setCurrentIndex,
}: ITabs) {
  return (
    <div className="flex gap-x-8 border-b-[1px] border-primary-11 overflow-x-auto">
      <TabBtn
        currentIndex={currentIndex}
        index={0}
        text="Public"
        setCurrentIndex={setCurrentIndex}
      />

      <TabBtn
        currentIndex={currentIndex}
        index={1}
        text="Private"
        setCurrentIndex={setCurrentIndex}
      />

      <TabBtn
        currentIndex={currentIndex}
        index={2}
        text="Liked"
        setCurrentIndex={setCurrentIndex}
      />

      <TabBtn
        currentIndex={currentIndex}
        index={3}
        text="Pinned"
        setCurrentIndex={setCurrentIndex}
      />
      {!hideDraft && (
        <TabBtn
          currentIndex={currentIndex}
          index={4}
          text="Draft"
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </div>
  );
}

export interface ITabBtn {
  currentIndex: number;
  index: number;
  text: TabText;
  setCurrentIndex: (value: number) => void;
}

export function TabBtn({ index, currentIndex, text, setCurrentIndex }: ITabBtn) {
  const [color, setColor] = useState<`#${string}`>("#5D5D5D");
  const pathname = usePathname();

  const handleClick = () => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (currentIndex === index) {
      setColor("#DADADA");
    } else {
      setColor("#5D5D5D");
    }
  }, [index, currentIndex]);

  return (
    <Link href={`${pathname}?s=${text}`}>
      <button
        className={`flex justify-center items-center gap-x-2 py-2 px-4 border-primary-1 ${currentIndex === index ? "border-b-2" : ""}`}
        onClick={handleClick}
      >
        <p style={{ color }} className={`text-[${color}]`}>
          {text}
        </p>

        <div>
          <TabIcon text={text} width="24px" height="24px" color={color} />
        </div>
      </button>
    </Link>
  );
}
