/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { ICompany } from "@/app/interface";
import {
  getCompanies,
  getCompanyById,
  updateCompany,
} from "@/app/services/companies";
import React, { useEffect, useState } from "react";
import DeleteCompany from "./deleteCompany";
import toast from "react-hot-toast";

const GetCompanies = () => {
  const [searchedCompany, setSearchedCompany] = useState<ICompany[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedCompany, setEditedCompany] = useState<ICompany | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) throw new Error("No hay un token disponible.");

      const respuesta = await getCompanies(token);
      setSearchedCompany(respuesta);
      toast.success("Empresas encontradas");
      setCompanyId("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSearchedCompany([]);
        toast.error(error.message);
      } else {
        toast.error("Ha ocurrido un error desconocido");
      }
    }
  };
  useEffect(() => {
    handleSearch();
  }, []);

  const handleEdit = (company: ICompany) => {
    if (company.id !== undefined && company.id !== null) {
      setEditingId(company.id);
      setEditedCompany({ ...company });
    }
  };

  const handleUpdate = async () => {
    if (!editedCompany || !editedCompany.id) return;

    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const dataToSend: Partial<ICompany> = {
        name: editedCompany.name,
      };

      await updateCompany(editedCompany.id, dataToSend, token);

      setSearchedCompany((prev) =>
        prev.map((u) =>
          u.id === editedCompany.id ? { ...u, ...dataToSend } : u
        )
      );

      setEditingId(null);
      setEditedCompany(null);
      toast.success("Usuario actualizado");
    } catch (err) {
      console.error("Error en updateUser:", err);
      setError("Error al actualizar el usuario");
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto text-foreground">
      <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800">
        Empresas Registrados
      </h2>

      <div className="flex flex-col gap-4">
        {searchedCompany.length > 0 ? (
          searchedCompany.map((company) => (
            <div
              key={company.id}
              className="flex flex-col gap-2 p-4 rounded-lg shadow-md text-foreground bg-fondo"
            >
              {editingId === company.id && editedCompany ? (
                <>
                  <h3 className="mb-2 text-xl font-semibold">Editar Usuario</h3>
                  <input
                    type="text"
                    value={editedCompany.name}
                    onChange={(e) =>
                      setEditedCompany({
                        ...editedCompany,
                        name: e.target.value,
                      })
                    }
                    className="p-2 border rounded"
                    placeholder="Nombre"
                  />

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleUpdate}
                      className="px-6 py-2 text-white rounded bg-greenP"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditedCompany(null);
                      }}
                      className="px-6 py-2 text-white bg-red-500 rounded"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold capitalize">
                    {company.name}
                  </h3>
                  <p>
                    <strong>Id:</strong> {company.id}
                  </p>

                  <button
                    onClick={() => handleEdit(company)}
                    className="px-4 py-2 mt-2 text-white rounded bg-blueP"
                  >
                    Editar
                  </button>
                  {company.id && typeof company.id === "string" && (
                    <DeleteCompany id={company.id} />
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No se encontraron colaboradores.</p>
        )}
      </div>
    </div>
  );
};

export default GetCompanies;
