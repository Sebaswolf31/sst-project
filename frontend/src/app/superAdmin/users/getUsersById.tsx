/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import { getUsersById, getUsersSuperAdmin } from "@/app/services/users";
import { updateUser } from "@/app/services/users";
import { IUser, UserRole } from "@/app/interface";
import toast from "react-hot-toast";
import DeleteUsers from "./deleteUsers";

const roleOptions = [
  { value: "", label: "Seleccione un rol" },
  { value: UserRole.RolSuperAdmin, label: "Administrador Superior" },
  { value: UserRole.RolAdministrador, label: "Administrador" },
  { value: UserRole.RolOperario, label: "Operador" },
];

const GetUsersById = () => {
  const [searchedUser, setSearchedUser] = useState<IUser | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!userId.trim()) {
      toast.error("Ingresa un ID del empleado");
      return;
    }

    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) throw new Error("No hay un token disponible.");
      console.log(userId, "userid que se emvia");
      const respuesta = await getUsersById(token, userId);

      setSearchedUser(respuesta);
      console.log(respuesta, "respuesta back getuserbyid");
      toast.success("Usuarios encontrados");
      setUserId("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSearchedUser(null);
        toast.error(error.message);
      } else {
        toast.error("Ha ocurrido un error desconocido");
      }
    }
  };

  const handleEdit = (user: IUser) => {
    if (user.id !== undefined && user.id !== null) {
      setEditingId(user.id);
      setEditedUser({ ...user });
    }
  };

  const handleUpdate = async () => {
    if (!editedUser || !editedUser.id) return;

    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) {
        setError("No hay token disponible");
        return;
      }

      const dataToSend: Partial<IUser> = {
        name: editedUser.name,
        email: editedUser.email,
        phone: editedUser.phone,
        identification: editedUser.identification,
        role: editedUser.role,
      };

      await updateUser(editedUser.id, dataToSend, token);

      setSearchedUser((prev) => (prev ? { ...prev, ...dataToSend } : prev));

      setEditingId(null);
      setEditedUser(null);
      toast.success("Usuario actualizado");
    } catch (err) {
      console.error("Error en updateUser:", err);
      setError("Error al actualizar el usuario");
    }
  };

  return (
    <div className="max-w-4xl p-6 mx-auto text-foreground">
      <h2 className="mb-8 text-2xl font-semibold text-center text-gray-800">
        Usuarios Registrados
      </h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Ingrese ID del usuario"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 text-black rounded bg-slate-100"
        />
        {userId && (
          <button onClick={handleSearch} className="px-4 py-2 rounded bg-verde">
            Buscar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {searchedUser ? (
          <div
            key={searchedUser.id}
            className="flex flex-col gap-2 p-4 rounded-lg shadow-md text-foreground bg-fondo"
          >
            {editingId === searchedUser.id && editedUser ? (
              <>
                <h3 className="mb-2 text-xl font-semibold">Editar Usuario</h3>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="Nombre"
                />
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="Email"
                />
                <input
                  type="text"
                  value={editedUser.phone || ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                  className="p-2 border rounded"
                  placeholder="Teléfono"
                />
                <input
                  type="text"
                  value={editedUser.identification || ""}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      identification: e.target.value,
                    })
                  }
                  className="p-2 border rounded"
                  placeholder="Identificación"
                />
                <select
                  value={editedUser.role}
                  onChange={(e) =>
                    setEditedUser({
                      ...editedUser,
                      role: e.target.value as UserRole,
                    })
                  }
                  className="p-2 border rounded"
                >
                  {roleOptions.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>

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
                      setEditedUser(null);
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
                  {searchedUser.name}
                </h3>
                <p>
                  <strong>Id:</strong> {searchedUser.id}
                </p>
                <p>
                  <strong>Email:</strong> {searchedUser.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {searchedUser.phone}
                </p>
                <p>
                  <strong>Identificación:</strong> {searchedUser.identification}
                </p>
                <p>
                  <strong>Rol:</strong> {searchedUser.role}
                </p>
                <button
                  onClick={() => handleEdit(searchedUser)}
                  className="px-4 py-2 mt-2 text-white rounded bg-blueP"
                >
                  Editar
                </button>
                {searchedUser.id && typeof searchedUser.id === "string" && (
                  <DeleteUsers id={searchedUser.id} />
                )}
              </>
            )}
          </div>
        ) : (
          <p>No se encontraron usuarios con este ID.</p>
        )}
      </div>
    </div>
  );
};

export default GetUsersById;
