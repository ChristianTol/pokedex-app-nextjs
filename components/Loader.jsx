import Image from "next/image";
import React from "react";
import pokeball from "../public/pokeball-2.png";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <figure className="animate-[spin_4s_infinite]">
        <Image src={pokeball} alt="Loading..." height="100px" width="100px" />
      </figure>
    </div>
  );
};
