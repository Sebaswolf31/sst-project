import React from "react";
import Image from "next/image";
import Button from "../components/botton";

const ActView = () => {
  return (
    <div>
      <div className="relative w-full mx-auto max-w-10xl">
        <div className="relative w-full aspect-[16/9]">
          <Image src="/act.png" alt="Imagen" fill className="object-contain" />
        </div>
        <div className="flex flex-col items-center justify-center pb-4">
          <Button> Contactanos</Button>
        </div>
      </div>
    </div>
  );
};

export default ActView;
