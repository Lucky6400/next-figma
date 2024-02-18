"use client";

import Image from "next/image";
import { memo } from "react";
import { navElements } from "@/constants";
import { ActiveElement, NavbarProps } from "@/types/type";
import ShapesMenu from "./ShapesMenu";
import { ActiveUsers } from "../Users/ActiveUsers";
import { NewThread } from "./comments/NewThread";
import { Button } from "../ui/button";

const Navbar = ({ activeElement, imageInputRef, handleImageUpload, handleActiveElement }: NavbarProps) => {
  const isActive = (value: string | Array<ActiveElement>) =>
    (activeElement && activeElement.value === value) ||
    (Array.isArray(value) && value.some((val) => val?.value === activeElement?.value));

  return (
    <nav className="flex select-none h-12 items-center bg-black justify-between gap-4 pb-1 bg-primary-black px-5 text-white">
      <div className="font-serif text-black text-xl">
        nxtFig
      </div>

      <ul className="flex flex-row fixed left-0 h-12 mx-auto top-0 w-max bg-black z-[999999]">
        {navElements.map((item: ActiveElement | any) => (
          <li
            key={item.name}
            onClick={() => {
              if (Array.isArray(item.value)) return;
              handleActiveElement(item);
            }}
            className={`group px-2.5 max-md:px-1 max-md:py-2 py-3 flex transition-all ease-in-out justify-center items-center
            ${isActive(item.value) ? "bg-blue-800" : "hover:bg-blue-800"}
            `}
          >
            {/* If value is an array means it's a nav element with sub options i.e., dropdown */}
            {Array.isArray(item.value) ? (
              <ShapesMenu
                item={item}
                activeElement={activeElement}
                imageInputRef={imageInputRef}
                handleActiveElement={handleActiveElement}
                handleImageUpload={handleImageUpload}
              />
            ) : item?.value === "comments" ? (
              // If value is comments, trigger the NewThread component
              <NewThread>
                <Button className="relative w-5 h-5 object-contain">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    fill
                    //className={isActive(item.value) ? "invert" : ""}
                  />
                </Button>
              </NewThread>
            ) : (
              <Button className="relative w-5 h-5 object-contain">
                <Image
                  src={item.icon}
                  alt={item.name}
                  fill
                  //className={isActive(item.value) ? "invert" : ""}
                />
              </Button>
            )}
          </li>
        ))}
      </ul>

      <ActiveUsers />
    </nav>
  );
};

export default memo(Navbar, (prevProps, nextProps) => prevProps.activeElement === nextProps.activeElement);
