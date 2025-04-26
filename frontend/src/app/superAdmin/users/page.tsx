"use client";
import React from "react";
import RegisterUser from "./registerUser";
import Accordion from "@/app/components/accordion";
import GetUsersByCompany from "./getUsers";

const Users = () => {
  return (
    <div>
      <div className="w-full p-4 rounded-t-xl">
        <h1 className="text-3xl font-semibold text-center ">
          Panel de Usuarios
        </h1>
        <hr className="w-full my-2 border-t-2 border-greenP" />
      </div>
      <Accordion title="Registro de usuarios por empresa contratante">
        <RegisterUser />
      </Accordion>
      <Accordion title="Usuarios por empresa contratante">
        <GetUsersByCompany />
      </Accordion>
    </div>
  );
};

export default Users;
