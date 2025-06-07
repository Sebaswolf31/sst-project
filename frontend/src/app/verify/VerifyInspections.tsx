/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { getInspections } from "../services/inspections";
import { FieldType, IFormattedInspection, IGetInspection } from "../interface";

const formatearInspeccion = (inspeccion: IGetInspection) => {
  const camposFormateados = Object.entries(inspeccion.dynamicFields).map(
    ([key, value]) => {
      const fieldInfo = inspeccion.template.fields.find(
        (f) => f.fieldName === key
      );

      let valorFormateado: string = String(value);

      if (
        fieldInfo?.type === FieldType.Fecha &&
        (typeof value === "string" || value instanceof Date)
      ) {
        valorFormateado = new Date(value).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      if (fieldInfo?.type === FieldType.Checkbox) {
        valorFormateado = value ? "Sí" : "No";
      }

      return {
        key,
        label: fieldInfo?.fieldName || key,
        valorFormateado,
      };
    }
  );

  return {
    ...inspeccion,
    camposFormateados,
  };
};

const VerifyInspections = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [inspections, setInspections] = useState<IFormattedInspection[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getInspections(page, limit);
      console.log("Respuesta con page", page, ":", res.data);
      const inspeccionesFormateadas = res.data.map(formatearInspeccion);
      setInspections(inspeccionesFormateadas);
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
              <strong>Codigo:</strong> {inspection.id}
            </p>
            <p className="text-sm">
              <strong>Tipo de Formulario de Inspeccion:</strong>{" "}
              {inspection.formType &&
                inspection.formType.charAt(0).toUpperCase() +
                  inspection.formType.slice(1)}
            </p>
            <p className="text-sm">
              <strong>Tipo de inspección:</strong>{" "}
              {inspection.inspectionType &&
                inspection.inspectionType.charAt(0).toUpperCase() +
                  inspection.inspectionType.slice(1)}
            </p>
            <p className="text-sm">
              <strong>Responsable: </strong> {inspection.inspector?.name}
            </p>

            {inspection.camposFormateados &&
              inspection.camposFormateados.length > 0 && (
                <div className="pl-4 mt-2">
                  {inspection.camposFormateados.map((campo, index) => (
                    <p key={index} className="text-sm">
                      <span className="font-semibold capitalize">
                        {campo.label}:
                      </span>{" "}
                      {campo.valorFormateado &&
                        campo.valorFormateado.charAt(0).toUpperCase() +
                          campo.valorFormateado.slice(1)}
                    </p>
                  ))}
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
