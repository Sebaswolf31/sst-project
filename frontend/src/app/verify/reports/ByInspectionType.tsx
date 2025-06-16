/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { IByInspectionType } from "@/app/interface";
import { getReportByInspectionType } from "@/app/services/inspections";
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

const ByInspectionType = () => {
  const [inspectionType, setInspectionType] = useState<IByInspectionType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getReportByInspectionType();
        console.log("GetinspectionsByTYPE", res);
        setInspectionType(res);
      } catch (error: unknown) {}
    };
    fetchData();
  }, []);
  const formattedData = inspectionType.map((item) => ({
    ...item,
    inspectionType:
      item.inspectionType.charAt(0).toUpperCase() +
      item.inspectionType.slice(1),
  }));
  return (
    <div className="w-auto p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Por tipo de inspeccion{" "}
      </h2>

      {inspectionType && inspectionType.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={formattedData}
            layout="horizontal"
            margin={{ top: 0, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="inspectionType" type="category" /> {/* ✅ */}
            <YAxis type="number" />
            <Tooltip />
            <Bar dataKey="count" fill="#17428F" radius={[10, 10, 0, 0]} />{" "}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-gray-500">Cargando datos...</p>
      )}
    </div>
  );
};

export default ByInspectionType;
