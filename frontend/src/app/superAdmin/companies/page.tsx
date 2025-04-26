import React from "react";
import GetCompany from "./getCompany";

const Companies = () => {
  return (
    <div>
      <div className="w-full p-4 rounded-t-xl">
        <h1 className="text-3xl font-semibold text-center ">
          Panel de Empresas
        </h1>
        <hr className="w-full my-2 border-t-2 border-greenP" />
      </div>
      <GetCompany />
    </div>
  );
};

export default Companies;
