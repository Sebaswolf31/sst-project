"use client";
import { ICompany } from "@/app/interface";
import { getCompanyById, updateCompany } from "@/app/services/companies";
import React, { useState } from "react";
import toast from "react-hot-toast";
import DeleteCompany from "./deleteCompany";

const GetCompany = () => {
  const [searchedCompany, setSearchedCompany] = useState<ICompany | null>(null);
  const [companyId, setCompanyId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedCompany, setEditedCompany] = useState<ICompany | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!companyId.trim()) {
      toast.error("Ingresa un ID de la empresa");
      return;
    }

    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) throw new Error("No hay un token disponible.");
      const respuesta = await getCompanyById(token, companyId);

      setSearchedCompany(respuesta);
      console.log(respuesta, "respuesta back get company by id");
      toast.success("Empresa encontrada");
      setCompanyId("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSearchedCompany(null);
        toast.error(error.message);
      } else {
        toast.error("Ha ocurrido un error desconocido");
      }
    }
  };

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

      setSearchedCompany((prev) => (prev ? { ...prev, ...dataToSend } : prev));

      setEditingId(null);
      setEditedCompany(null);
      toast.success("Nombre de empresa actualizado");
    } catch (err) {
      console.error("Error en update de empresa:", err);
      setError("Error al actualizar la empresa");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mx-4 mb-6">
        <input
          type="text"
          placeholder="Ingrese ID de la empresa"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-full p-2 text-black rounded bg-slate-100"
        />
        {companyId && (
          <button onClick={handleSearch} className="px-4 py-2 bg-verde">
            Buscar
          </button>
        )}
        {searchedCompany && (
          <button
            onClick={() => {
              setSearchedCompany(null);
              setCompanyId("");
            }}
            className="px-2 text-sm text-white bg-red-500 rounded"
          >
            Limpiar Filtro
          </button>
        )}
      </div>

      <div className="flex items-center justify-center w-full mt-6">
        {searchedCompany ? (
          <div
            key={searchedCompany.id}
            className="flex flex-col gap-4 p-4 rounded-lg shadow-md text-foreground lex"
          >
            {editingId === searchedCompany.id && editedCompany ? (
              <>
                <h3 className="mb-2 text-xl font-semibold">Editar Empresa</h3>
                <input
                  type="text"
                  value={editedCompany?.name}
                  onChange={(e) =>
                    setEditedCompany({ ...editedCompany, name: e.target.value })
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
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold capitalize">
                    {searchedCompany?.name}
                  </h3>
                  <h3 className="text-lg">{searchedCompany?.id}</h3>

                  <button
                    onClick={() => handleEdit(searchedCompany!)}
                    className="px-4 py-2 mt-2 text-white rounded bg-blueP"
                  >
                    Editar
                  </button>

                  {searchedCompany?.id &&
                    typeof searchedCompany?.id === "string" && (
                      <DeleteCompany id={searchedCompany?.id} />
                    )}
                </div>
              </>
            )}
          </div>
        ) : (
          <p>No se encontraron empresas con este ID.</p>
        )}
      </div>
    </div>
  );
};

export default GetCompany;
