import React, { useEffect, useState } from "react";
import { Field, ErrorMessage, useFormikContext } from "formik";
import { getCompanies } from "@/app/services/companies";
import { ICompany } from "@/app/interface";
const SelectCompany = () => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { setFieldValue } = useFormikContext<any>();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("access_token") || "";
        const response = await getCompanies(token);
        setCompanies(response);
      } catch (error) {
        console.error("Error al obtener empresas", error);
      }
    };
    fetchCompanies();
  }, []);
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setFieldValue("companyId", selectedId);
  };
  return (
    <div>
      <Field
        name="companyId"
        as="select"
        onChange={handleSelect}
        className="w-full p-3 text-gray-800 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-greenP"
      >
        <option value="">Seleccione una empresa</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </Field>
      <ErrorMessage
        name="companyId"
        component="div"
        className="mt-2 text-sm text-red-500"
      />
    </div>
  );
};

export default SelectCompany;
