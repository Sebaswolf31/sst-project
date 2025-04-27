"use client";
import React from "react";
import CreateCompany from "./createCompany";
import Accordion from "@/app/components/accordion";
import GetCompany from "./getCompany";
import GetCompanies from "./getCompanies";

const Companies = () => {
  return (
    <div>
      <div className="w-full p-4 rounded-t-xl">
        <h1 className="text-3xl font-semibold text-center ">
          Panel de Empresas
        </h1>
        <hr className="w-full my-2 border-t-2 border-greenP" />
      </div>
      <Accordion title="Registro de empresa">
        <CreateCompany />
      </Accordion>
      <Accordion title="Listado de empresas">
        <GetCompanies />
      </Accordion>
      <Accordion title="Busqueda de empresa por ID">
        <GetCompany />
      </Accordion>
    </div>
  );
};

export default Companies;
