import React from "react";
import { assets } from "../assets/assets";

function Footer() {
  return (
    <div className="container px-4 2xl:px-20 flex justify-between items-center gap-4 py-3 mt-20">
      <img width={160} src={assets.logo} alt="DhruvilStack logo" />

      <p className="flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-lg:hidden">
        Copyright © DhruvilStack.dev | All rights reserved.
      </p>

      <div className="flex gap-2.5">
        <a
          href="https://www.facebook.com/share/1HUYoiM5UA/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img width={38} src={assets.facebook_icon} alt="Facebook" />
        </a>

        <a
          href="https://x.com/bhattirajan007"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img  width = {38} src={assets.twitter_icon} alt="Twitter" />
        </a>

        <a
          href="\https://www.instagram.com/bhattirajan007?igsh=MTYxeW92cWNicWNtNw=="
          target="_blank"
          rel="noopener noreferrer"
        >
          <img width={38} src={assets.instagram_icon} alt="Instagram" />
        </a>
      </div>
    </div>
  );
}

export default Footer;
