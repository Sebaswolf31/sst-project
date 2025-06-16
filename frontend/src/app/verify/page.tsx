import React from "react";
import VerifyInspections from "./VerifyInspections";
import Stadistics from "./stadistics";

const VerifyView = () => {
  return (
    <div className="w-auto p-4">
      <h1 className="text-2xl font-semibold text-center text-gray-800">
        Verifica Inspecciones
      </h1>
      <p className="mb-2 text-xs font-thin text-center text-gray-800">
        Consulta todas las inspecciones realizadas y accede a las estadísticas
        clave de tu empresa para tomar decisiones informadas.
      </p>
      <Stadistics />
      <VerifyInspections />
    </div>
  );
};

export default VerifyView;
