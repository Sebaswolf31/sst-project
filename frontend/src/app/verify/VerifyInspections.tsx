"use client";
import React, { useEffect, useState } from "react";
import { getInspections } from "../services/inspections";
import { IGetInspection } from "../interface";

const VerifyInspections = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [inspections, setInspections] = useState<IGetInspection[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getInspections(page, limit);
      console.log("Respuesta con page", page, ":", res.data);
      setInspections(res.data);
      setTotal(res.total);
    };
    fetchData();
  }, [page, limit]);
  const goToPreviousPage = () => {
    setPage((p) => Math.max(p - 1, 1));
  };
  const maxPage = Math.ceil(total / limit);
  const goToNextPage = () => {
    setPage((p) => Math.min(p + 1, maxPage));
  };
  return (
    <div className="w-auto p-4">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Verifica Inspecciones
      </h1>
      <p className="mb-2 text-xs font-thin text-center text-gray-800">
        Consulta todas las inspecciones realizadas y accede a las estadísticas
        clave de tu empresa para tomar decisiones informadas.
      </p>

      {inspections.length === 0 ? (
        <p>No hay inspecciones para mostrar.</p>
      ) : (
        inspections.map((inspection) => (
          <details key={inspection.id} className="p-2 mb-4 border rounded">
            <summary className="font-semibold cursor-pointer">
              {inspection.title}
            </summary>
            <p className="mt-2 text-sm">
              <strong>Fecha:</strong>{" "}
              {new Date(inspection.date).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-sm">
              <strong>Responsable:</strong> {inspection.inspector?.name}
            </p>

            {inspection.dynamicFields &&
              Object.keys(inspection.dynamicFields).length > 0 && (
                <div className="pl-4 mt-2">
                  {Object.entries(inspection.dynamicFields).map(
                    ([key, value], index) => (
                      <p key={index} className="text-sm">
                        <span className="font-semibold capitalize">{key}:</span>{" "}
                        {typeof value === "object"
                          ? JSON.stringify(value)
                          : value}
                      </p>
                    )
                  )}
                </div>
              )}
          </details>
        ))
      )}

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={goToPreviousPage}
          disabled={page === 1}
          className="px-2 py-1 text-xs text-white rounded bg-blueP hover:bg-greenP"
        >
          Anterior
        </button>
        <button
          onClick={goToNextPage}
          disabled={page * limit >= total}
          className="px-2 py-1 text-xs text-white rounded bg-blueP hover:bg-greenP"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VerifyInspections;
