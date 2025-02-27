"use client";
import { ReactNode, useRef, useState } from "react";
import Notification from "./topup";
import { FlashIcon, ScrollTopIcon } from "../components/icons";
import { useUser } from "@/hooks/useUser";
import { useNotifications } from "@/hooks/useNotifications";
import Image from "next/image";
import Topup from "./topup";

interface INotificationProps {
  children: ReactNode;
}

// const dummy = [1, 2, 3, 4, 5, 6, 8, 1, 2, 3, 4, 5, 6, 8];

export default function Menu({ children }: INotificationProps) {

  const { userId } = useUser();


  const [open, setOpen] = useState(false);
  const [topup, setTopup] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleTopup = () => {
    setTopup(true)
    handleClose()
  }


  return (
    <>
      <button onClick={() => setOpen(true)}>{children}</button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            className="fixed z-50  top-0 left-0 h-screen w-full"
          ></div>

          <div className="absolute w-full max-w-[240px] h-[308px] z-50 bottom-2 md:bottom-[5vh] left-0 md:left-44 border-primary-8 border-[1px] bg-[#191919] rounded-lg">
            
            <div className="flex items-center gap-2 text-primary-6 h-16 p-3 border-primary-8 border-b-[1px]">
              <div>
                <Image className="rounded-full" src={"/icons/dummy-profile.png"} width={40} height={40} alt="" /> 
              </div>
              <div className="flex flex-col">
                <p className="">Olivia Rhye</p>
                <p className="">olivia@untitledui.com</p>
              </div>
            </div>

            <MenuItem 
              onClick={handleClose} 
              icon={<FlashIcon width={16} height={16} color="#C1C1C1" />} 
              text="10 credits" 
              action={(
                <button 
                  onClick={handleTopup} 
                  className="underline">
                  Top Up
                </button>)
              } />

    
            <MenuItem onClick={handleClose} icon={<FlashIcon width={16} height={16} color="#C1C1C1" />} text="LinkedIn" underlineOff={true} />

            <MenuItem onClick={handleClose} icon={<Image src={"/icons/telegram.png"} width={16} height={16} alt="telegram" />} text="Telegram" underlineOff={true} />

            <MenuItem onClick={handleClose} icon={<FlashIcon width={16} height={16} color="#C1C1C1" />} text="x  (formerly Twitter)" />

            <MenuItem onClick={handleClose} icon={<FlashIcon width={16} height={16} color="#C1C1C1" />} text="Dark Theme" />

            <MenuItem onClick={handleClose} icon={<FlashIcon width={16} height={16} color="#C1C1C1" />} text="Logout" underlineOff={true} />


          </div>

        </>
      )}

      <Topup open={topup} setOpen={setTopup} />

    </>
  );
}


export function MenuItem({ icon, text, underlineOff, action, onClick } : { icon: ReactNode, text: string, onClick: () => void,  underlineOff?: boolean, action?: ReactNode }) {

  return (
    <div onClick={onClick} className={`flex justify-between py-2 px-4 border-primary-8 text-primary-6 h-10 ${!underlineOff ? "border-b-[1px]" : ""}`}>
      <div className="flex gap-2 items-center justify-center">
        <div>{icon}</div>
        <p>{text}</p>
      </div>
      {action}
    </div>
  )

}