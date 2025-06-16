"use client";
import { ITotalReport } from "@/app/interface";
import { getInspectionsReport } from "@/app/services/inspections";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TotalReport = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState<ITotalReport>({ total: 0 });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInspectionsReport();
        setTotal(res);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setTotal({ total: 0 });
          toast.error(error.message);
        } else {
          toast.error("Ha ocurrido un error desconocido");
        }
      }
    };
    fetchData();
  }, []);
  return (
    <div className="w-auto p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Total de Inspecciones realizadas
      </h2>
      <div className="flex items-center justify-center h-64 ">
        <p className="text-8xl">{total.total}</p>
      </div>
    </div>
  );
};

export default TotalReport;
