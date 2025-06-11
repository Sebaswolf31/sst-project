/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { IInspection, IInspectionByForm } from "@/app/interface";
import { getInspectionsReportByFormType } from "@/app/services/inspections";
import React, { useEffect, useState } from "react";

const ByFormType = () => {
  const [inspectionByFormType, setInspectionsByFormType] = useState<
    IInspectionByForm[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getInspectionsReportByFormType();
        console.log("GetinspectionsByform", res);
      } catch (error: unknown) {}
    };
    fetchData();
  }, []);
  return <div>ByFormType</div>;
};

export default ByFormType;
