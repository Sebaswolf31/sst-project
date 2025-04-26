import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { deleteUserService } from "@/app/services/users";

interface DeleteUsersProps {
  id: string;
}
const DeleteCompany: React.FC<DeleteUsersProps> = ({ id }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    console.log("Intentando eliminar la compañia con id:", id);
    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      console.log(token, "token en delte");
      if (!token) {
        toast.error("No hay token disponible");
        setLoading(false);
        return;
      }

      const success = await deleteUserService(id, token);
      if (!success) {
        throw new Error("No se pudo eliminar a la Empresa.");
      }

      toast.success("Empresa Eliminada Exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error al desactivar usuario:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 ml-1 text-white bg-red-500 rounded"
      disabled={loading}
    >
      {loading ? "Desactivando..." : "Desactivar"}
    </button>
  );
};

export default DeleteCompany;
