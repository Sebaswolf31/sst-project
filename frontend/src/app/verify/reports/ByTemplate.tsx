/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { IinspectionByTemplate } from "@/app/interface";
import { getInspectionsReportByTemplate } from "@/app/services/inspections";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const ByTemplate = () => {
  const [inspectionsByTemplate, setInspectionsByTemplate] = useState<
    IinspectionByTemplate[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInspectionsReportByTemplate();
        console.log("Respuesta get inspection by template", ":", res);
        setInspectionsByTemplate(res);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setInspectionsByTemplate([]);
          toast.error(error.message);
        } else {
          toast.error("Ha ocurrido un error desconocido");
        }
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h2>Reporte por tipo de template creado</h2>
      <div>
        {inspectionsByTemplate.length > 0 ? (
          inspectionsByTemplate.map((inspections) => (
            <div key={inspections.templateId}>
              <p>
                <strong>Nombre del template:</strong> {inspections.templateName}
              </p>
              <p>
                <strong>Inspecciones realizadas con ese template:</strong>{" "}
                {inspections.count}
              </p>
              <hr />
            </div>
          ))
        ) : (
          <p>No hay datos para mostrar</p>
        )}
      </div>
    </div>
  );
};
export default ByTemplate;
