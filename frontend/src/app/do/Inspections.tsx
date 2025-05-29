/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { getInpectionTemplate } from "../services/inspectiontemplates";
import toast from "react-hot-toast";
import {
  CreateInspectionTemplateDto,
  FieldType,
  IInspection,
  CreateInspection,
} from "../interface";
import { createInspection } from "../services/inspections";
import { useAuth } from "../contexts/authContext";

const Inspections = () => {
  const [templates, setTemplates] = useState<CreateInspectionTemplateDto[]>([]);
  const { user } = useAuth();
  const [formData, setFormData] = useState<{
    [templateId: string]: {
      [fieldName: string]: any;
    };
  }>({});
  const [errors, setErrors] = useState<{
    [templateId: string]: { [fieldName: string]: string };
  }>({});

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await getInpectionTemplate();
        setTemplates(res.data);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
        toast.error("Error al traer plantillas");
      }
    };

    fetchTemplates();
  }, []);
  const handleCancel = (templateId: string) => {
    {
      setFormData((prev) => ({
        ...prev,
        [templateId]: {},
      }));
      setErrors({});
    }
  };
  const handleChange = (templateId: string, fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [fieldName]: value,
      },
    }));
  };

  const renderField = (
    templateId: string,
    field: IInspection,
    index: number
  ) => {
    const { type, displayName, required, options, fieldName } = field;

    const value =
      formData[templateId]?.[fieldName] ??
      (type === FieldType.Checkbox ? false : "");

    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      let val: any;
      if (type === FieldType.Checkbox) {
        val = (e.target as HTMLInputElement).checked;
      } else {
        val = e.target.value;
      }
      handleChange(templateId, fieldName, val);
    };

    switch (type) {
      case FieldType.Texto:
        return (
          <input
            type="text"
            required={required}
            placeholder={displayName}
            value={value}
            onChange={onChange}
          />
        );
      case FieldType.Numero:
        return (
          <input
            type="number"
            required={required}
            placeholder={displayName}
            value={value}
            onChange={onChange}
          />
        );
      case FieldType.Checkbox:
        return (
          <label>
            <input
              type="checkbox"
              required={required}
              checked={value}
              onChange={onChange}
            />{" "}
            {displayName}
          </label>
        );
      case FieldType.Fecha:
        return (
          <input
            type="date"
            required={required}
            value={value}
            onChange={onChange}
          />
        );
      case FieldType.Opciones:
        return (
          <select required={required} value={value} onChange={onChange}>
            <option value="">Seleccione una opción</option>
            {options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      default:
        return <p>Tipo no soportado</p>;
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    template: CreateInspectionTemplateDto
  ) => {
    e.preventDefault();
    const newErrors: { [fieldName: string]: string } = {};
    const formValues = formData[template.id!] || {};

    template.fields.forEach((field) => {
      if (
        field.required &&
        (formValues[field.fieldName] === undefined ||
          formValues[field.fieldName] === "" ||
          formValues[field.fieldName] === null)
      ) {
        newErrors[field.fieldName] = `${field.displayName} es obligatorio`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        [template.id!]: newErrors,
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [template.id!]: {},
    }));
    const title = template.name;
    const date = new Date();
    const inspectorId = user?.id;

    const dynamicFields = formData[template.id!] || {};

    const inspectionToSend: CreateInspection = {
      title,
      date,
      inspectorId,
      templateId: template.id!,
      dynamicFields,
    };

    try {
      await createInspection(inspectionToSend);
      toast.success("Inspección guardada correctamente");

      setFormData((prev) => ({
        ...prev,
        [template.id!]: {},
      }));
    } catch (error) {
      toast.error("Error al guardar inspección");
    }
  };

  return (
    <div className="w-auto p-4 ">
      <h1 className="text-2xl font-semibold text-center text-gray-800 ">
        {" "}
        Realizar Inspecciones
      </h1>
      <p className="mb-2 text-xs font-thin text-center text-gray-800 ">
        Realiza inspecciones detalladas y precisas para garantizar la calidad y
        seguridad de tus procesos.
      </p>
      {templates.map((template) => (
        <details
          key={template.id}
          className="p-4 mb-4 border border-gray-300 rounded-md bg-gray-50"
        >
          <summary className="font-semibold cursor-pointer">
            {template.name}
          </summary>
          <p className="text-sm">
            {" "}
            Fecha:
            {new Date().toLocaleDateString("es-CO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>{" "}
          <form onSubmit={(e) => handleSubmit(e, template)}>
            {template.fields.map((field, index) => (
              <div key={index} className="mb-4">
                <label className="block mb-1 font-semibold">
                  {field.displayName}
                </label>
                {renderField(template.id!, field, index)}
                {errors[template.id!] &&
                  errors[template.id!][field.fieldName] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[template.id!][field.fieldName]}
                    </p>
                  )}
              </div>
            ))}
            <button
              type="submit"
              className="px-3 py-2 mx-2 text-white rounded bg-blueP hover:bg-greenP"
            >
              Guardar cambios
            </button>
            <button
              type="button"
              className="px-3 py-2 mx-2 text-sm text-white bg-red-500 rounded"
              onClick={() => handleCancel(template.id!)}
            >
              Cancelar
            </button>
          </form>
        </details>
      ))}
    </div>
  );
};

export default Inspections;
