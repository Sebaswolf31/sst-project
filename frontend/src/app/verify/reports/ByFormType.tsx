/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { IInspection, IInspectionByForm } from "@/app/interface";
import { getInspectionsReportByFormType } from "@/app/services/inspections";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ByFormType = () => {
  const [inspectionByFormType, setInspectionsByFormType] = useState<
    IInspectionByForm[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInspectionsReportByFormType();
        console.log("GetinspectionsByform", res);
        setInspectionsByFormType(res);
      } catch (error: unknown) {}
    };
    fetchData();
  }, []);
  const formattedData = inspectionByFormType.map((item) => ({
    ...item,
    inspectionByForm:
      item.formType.charAt(0).toUpperCase() + item.formType.slice(1),
  }));
  return (
    <div className="w-full p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Inspecciones realizadas por tipo de formulario
      </h2>
      {inspectionByFormType && inspectionByFormType.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="inspectionByForm" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="count" fill="#17428F" radius={[0, 10, 10, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">Cargando datos...</p>
      )}
    </div>
  );
};

export default ByFormType;
