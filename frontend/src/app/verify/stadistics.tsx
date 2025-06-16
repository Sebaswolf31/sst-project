"use client";

import React from "react";
import TotalReport from "./reports/TotalReport";
import ByFormType from "./reports/ByFormType";
import ByTemplate from "./reports/ByTemplate";
import ByInspectionType from "./reports/ByInspectionType";

const Stadistics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      <TotalReport />
      <ByFormType />
      <ByTemplate />
      <ByInspectionType />
    </div>
  );
};

export default Stadistics;
