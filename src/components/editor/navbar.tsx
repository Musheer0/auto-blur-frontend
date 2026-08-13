import React from "react";
import { UserNav } from "../user-nav";
import { ThemeSwitcher } from "../theme-switcher";
import SocialLinks from "./nav-links";

const Navbar = () => {
  return (
    <nav className="w-full  flex px-4 py-2 items-center bg-sidebar/5">
      <div className="logo font-host flex items-center gap-3">
        <img
          src="/logo.png"
          width={30}
          height={30}
          className="rounded-2xl"
          alt=""
        />
        <h1 className="font-bold">BlurField</h1>
      </div>
      <SocialLinks />
      <div className="user ml-auto max-w-40 flex items-center gap-4">
        <UserNav />
      </div>
    </nav>
  );
};

export default Navbar;
