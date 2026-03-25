import { Avatar } from "@heroui/react";
import React from "react";

const SideBar = () => {
  return (
    <aside>
      <div>
        <h1 className="text-3xl">ZS</h1>
        <Avatar>
          <Avatar.Image alt="ZimJAM" src="/images/avatar.jpeg" />
          <Avatar.Fallback>Zim JAM</Avatar.Fallback>
        </Avatar>
      </div>
    </aside>
  );
};

export default SideBar;
