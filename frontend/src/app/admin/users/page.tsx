"use client";
import React from "react";
import RegisterUser from "./registerUsers";
import Accordion from "@/app/components/accordion";
import GetUsersById from "./getUsersById";
import GetUsers from "./getUsers";
//import GetUsersByCompany from "./getUsers";
//import GetUsersById from "./getUsersById";

const Users = () => {
  return (
    <div>
      <div className="w-full p-4 rounded-t-xl">
        <h1 className="text-3xl font-semibold text-center ">
          Panel de Usuarios
        </h1>
        <hr className="w-full my-2 border-t-2 border-greenP" />
      </div>
      <Accordion title="Registro de colaboradores">
        <RegisterUser />
      </Accordion>
      <Accordion title="Listado de colaboradores">
        <GetUsers />
      </Accordion>
      <Accordion title="Buscar colaboradores por ID">
        <GetUsersById />
      </Accordion>
    </div>
  );
};

export default Users;
