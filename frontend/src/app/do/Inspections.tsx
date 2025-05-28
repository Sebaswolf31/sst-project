"use client";

import React, { useEffect, useState } from "react";
import { getInpectionTemplate } from "../services/inspectiontemplates";
import toast from "react-hot-toast";
import {
  CreateInspectionTemplateDto,
  FieldType,
  IInspection,
} from "../interface";

const Inspections = () => {
  const [templates, setTemplates] = useState<CreateInspectionTemplateDto[]>([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await getInpectionTemplate();
        console.log(res);
        setTemplates(res.data);
      } catch (error) {
        console.error("Error al cargar plantillas:", error);
        toast.error("Error al traer plantillas");
      }
    };

    fetchTemplates();
  }, []);

  // 2️⃣ Función para renderizar cada campo según su tipo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderField = (field: IInspection, index: number) => {
    const { type, displayName, required, options } = field;

    switch (type) {
      case FieldType.Texto:
        return (
          <input type="text" required={required} placeholder={displayName} />
        );
      case FieldType.Numero:
        return (
          <input type="number" required={required} placeholder={displayName} />
        );
      case FieldType.Checkbox:
        return (
          <label>
            <input type="checkbox" required={required} /> {displayName}
          </label>
        );
      case FieldType.Fecha:
        return <input type="date" required={required} />;
      case FieldType.Opciones:
        return (
          <select required={required}>
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

  // 3️⃣ Renderizar cada plantilla con acordeón
  return (
    <div>
      {templates.map((template: CreateInspectionTemplateDto) => (
        <details key={template.id}>
          <summary>{template.name}</summary>
          <form>
            {template.fields.map((field: IInspection, index: number) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <label>{field.displayName}</label>
                {renderField(field, index)}
              </div>
            ))}
            <button type="submit">Guardar cambios</button>
          </form>
        </details>
      ))}
    </div>
  );
};

export default Inspections;
