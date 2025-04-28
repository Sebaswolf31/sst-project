/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { getUsersSuperAdmin } from "@/app/services/users";
import { updateUser } from "@/app/services/users"; // <-- asegúrate de tener esto activo
import { IUser, UserRole } from "@/app/interface";
import toast from "react-hot-toast";
import DeleteUsers from "./deleteUsers";
import { useAuth } from "@/app/contexts/authContext";

const roleOptions = [
  { value: "", label: "Seleccione un rol" },
  { value: UserRole.RolSuperAdmin, label: "Administrador Superior" },
  { value: UserRole.RolAdministrador, label: "Administrador" },
  { value: UserRole.RolOperario, label: "Operador" },
];

const GetUsers = () => {
  const [searchedUsers, setSearchedUsers] = useState<IUser[]>([]);
  const [companyId, setCompanyId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<IUser | null>(null);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const handleSearch = async () => {
    const companyId = user?.companyId;
    if (!companyId) {
      toast.error("No se encontró la empresa del usuario actual");
      return;
    }
    try {
      const token = localStorage.getItem("access_token") || "";
      if (!token) throw new Error("No hay un token disponible.");

      const respuesta = await getUsersSuperAdmin(token, companyId);
      setSearchedUsers(respuesta);
      toast.success("Usuarios encontrados");
      setCompanyId("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSearchedUsers([]);
        toast.error(error.message);
      } else {
        toast.error("Ha ocurrido un error desconocido");
      }
    }
  };
  useEffect(() => {
    handleSearch();
  }, []);

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

      setSearchedUsers((prev) =>
        prev.map((u) => (u.id === editedUser.id ? { ...u, ...dataToSend } : u))
      );

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
        Colaboradores Registrados
      </h2>

      <div className="flex flex-col gap-4">
        {searchedUsers.length > 0 ? (
          searchedUsers.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-2 p-4 rounded-lg shadow-md text-foreground bg-fondo"
            >
              {editingId === user.id && editedUser ? (
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
                  <h3 className="text-lg font-bold capitalize">{user.name}</h3>
                  <p>
                    <strong>Id:</strong> {user.id}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {user.phone}
                  </p>
                  <p>
                    <strong>Identificacion:</strong> {user.identification}
                  </p>
                  <p>
                    <strong>Rol:</strong> {user.role}
                  </p>
                  <button
                    onClick={() => handleEdit(user)}
                    className="px-4 py-2 mt-2 text-white rounded bg-blueP"
                  >
                    Editar
                  </button>
                  {user.id && typeof user.id === "string" && (
                    <DeleteUsers id={user.id} />
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

export default GetUsers;
