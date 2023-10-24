import React from "react";
import Image from "next/image";

import Spinner from "@/public/assets/images/infinite-spinner.svg";
import Circles from "@/public/assets/images/bouncing-circles.svg";

interface Props {
  type: "spinner" | "circles";
}

const Loader = ({ type }: Props) => {
  return (
    <div className="flex justify-center w-full mt-20">
      {type === "spinner" ? (
        <Image src={Spinner} alt="loader" width={100} height={100} />
      ) : (
        <Image src={Circles} alt="loader" width={100} height={100} />
      )}
    </div>
  );
};

export default Loader;
