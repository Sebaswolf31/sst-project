"use client";
import { IinspectionByTemplate } from "@/app/interface";
import { getInspectionsReportByTemplate } from "@/app/services/inspections";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ByTemplate = () => {
  const [inspectionsByTemplate, setInspectionsByTemplate] = useState<
    IinspectionByTemplate[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInspectionsReportByTemplate();
        console.log("Respuesta get inspection by template:", res);
        setInspectionsByTemplate(res);
      } catch (error: unknown) {
        setInspectionsByTemplate([]);
        toast.error(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error desconocido"
        );
      }
    };
    fetchData();
  }, []);

  const formattedData = inspectionsByTemplate.map((item) => ({
    ...item,
    templateName:
      item.templateName.charAt(0).toUpperCase() + item.templateName.slice(1),
  }));

  return (
    <div className="w-full p-4 ">
      <h2 className="mb-4 text-xl font-bold text-center">
        Inspecciones realizadas por plantilla
      </h2>
      {formattedData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="templateName" type="category" width={140} />
            <Tooltip />
            <Bar dataKey="count" fill="#17428F " radius={[0, 10, 10, 0]}></Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">No hay datos para mostrar</p>
      )}
    </div>
  );
};

export default ByTemplate;
