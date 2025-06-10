"use client";
import { getInspectionsReportByTemplate } from "@/app/services/inspections";
import React, { useEffect } from "react";

const ResportByTemplate = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = await getInspectionsReportByTemplate();
      console.log("Respuesta con page", ":", res);
    };
    fetchData();
  }, []);
  return <div>ResportByTemplate</div>;
};

export default ResportByTemplate;
