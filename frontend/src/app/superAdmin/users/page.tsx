"use client";
import React, { useEffect } from "react";
import RegisterUser from "./registerUser";
import Accordion from "@/app/components/accordion";
import GetUsersByCompany from "./getUsers";
import GetUsersById from "./getUsersById";
import { useAuth } from "@/app/contexts/authContext";
import { useRouter } from "next/navigation";
import { isAdmin } from "@/app/helpers/authhelpers";
import { routes } from "@/app/routes/routes";

const Users = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAdmin(user)) {
      router.push(routes.home);
    }
  }, [user]);

  if (!isAdmin(user)) {
    return null;
  }
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
      <Accordion title="Busqueda de usuarios por ID">
        <GetUsersById />
      </Accordion>
    </div>
  );
};

export default Users;
