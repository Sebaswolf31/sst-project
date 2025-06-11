"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FieldType, InspectionType } from "../interface";
import { IInspection } from "../interface";
import toast from "react-hot-toast";
import { createInpectionTemplate } from "../services/inspectiontemplates";

export default function FormBuilder() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inspectionName, setInspectionName] = useState("");
  const [fields, setFields] = useState<IInspection[]>([]);
  const [newField, setNewField] = useState<IInspection>({
    fieldName: "",
    displayName: "",
    date: "" as unknown as Date,
    inspectionType: "" as InspectionType,
    type: "" as FieldType,
    required: false,
    options: [],
  });

  const handleAddField = () => {
    if (!newField.fieldName || !newField.fieldName) {
      toast.error("Completa el nombre del campo");
      return;
    }

    setFields([...fields, { ...newField, id: uuidv4() }]);
    setNewField({
      fieldName: "",
      displayName: "",
      date: "" as unknown as Date,
      inspectionType: "" as InspectionType,
      type: "" as FieldType,
      required: false,
      options: [],
    });
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleAddOption = () => {
    const label = prompt("Etiqueta de la opción:");
    if (label) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), label],
      });
    }
  };

  const handleSaveTemplate = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cleanFields = fields.map(({ id, ...field }) => field);
      const nameUpperCase =
        inspectionName.charAt(0).toUpperCase() + inspectionName.slice(1);
      const InspectionTemplate = {
        name: nameUpperCase,
        date: new Date(),
        fields: cleanFields,
      };
      console.log(InspectionTemplate);
      await createInpectionTemplate(InspectionTemplate);
      toast.success("Plantilla guardada");
      setFields([]);
      setInspectionName("");
      setNewField({
        fieldName: "",
        displayName: "",
        date: "" as unknown as Date,
        inspectionType: "" as InspectionType,
        type: FieldType.Texto,
        required: false,
        options: [],
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="max-w-2xl p-4 m-4 mx-auto border rounded shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center">
        Crear nueva plantilla
      </h2>
      <p className="pb-2 pl-2 text-sm">
        Creación Plantilla :{" "}
        {new Date().toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>{" "}
      <input
        className="w-full gap-2 p-2 mb-4 border "
        type="text"
        placeholder=" Nombre de la plantilla de inspección"
        value={inspectionName}
        onChange={(e) => setInspectionName(e.target.value)}
      ></input>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <select
          value={newField.inspectionType}
          onChange={(e) =>
            setNewField({
              ...newField,
              inspectionType: e.target.value as InspectionType,
            })
          }
          className="block w-full col-span-2 p-2 border "
        >
          <option value=""> Tipo de plantilla de inspeccion</option>
          <option value="areas y puestos de trabajo">
            Areas y puestos de trabajo
          </option>
          <option value="maquinaria y equipos">Maquinaria y equipos</option>
          <option value="elementos de protección personal">
            Elementos de protección personal
          </option>
          <option value="botiquines y camillas">Botiquines y camillas</option>
        </select>
        <input
          type="text"
          placeholder="Nombre del campo"
          value={newField.displayName}
          onChange={(e) =>
            setNewField({
              ...newField,
              displayName: e.target.value,
              fieldName: e.target.value,
            })
          }
          className="p-2 border"
        />
        <select
          value={newField.type}
          onChange={(e) =>
            setNewField({
              ...newField,
              type: e.target.value as FieldType,
              options: [],
            })
          }
          className="p-2 border"
        >
          <option value=""> Tipo de campo requerido</option>
          <option value="text">Texto</option>
          <option value="number">Número</option>
          <option value="dropdown">Seleccionable</option>
          <option value="checkbox">Checkbox</option>
          <option value="date">Fecha</option>
        </select>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={newField.required}
            onChange={(e) =>
              setNewField({ ...newField, required: e.target.checked })
            }
            className="mr-2"
          />
          Campo Requerido
        </label>
        {newField.type === "dropdown" && (
          <button
            type="button"
            onClick={handleAddOption}
            className="col-span-2 p-2 text-white rounded bg-blueP"
          >
            Añadir opción
          </button>
        )}
      </div>
      {newField.options && newField.options.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium">Opciones:</p>
          <ul className="pl-5 text-sm list-disc">
            {newField.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={handleAddField}
        className="block w-full p-2 mx-auto mb-6 text-white rounded bg-blueP"
      >
        Añadir campo a la plantilla
      </button>
      <h3 className="mb-2 text-lg font-semibold">Campos actuales:</h3>
      <ul className="mb-4">
        {fields.map((field) => (
          <li key={field.id} className="flex items-center justify-between mb-1">
            <span>
              <strong>{field.displayName}</strong> ({field.displayName}) -{" "}
              {field.type}
              {field.required ? " *" : ""}
            </span>
            <button
              className="text-sm text-red-600"
              onClick={() => handleRemoveField(field.id!)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleSaveTemplate}
        className="block px-4 py-2 mx-auto text-white rounded bg-greenP"
      >
        Guardar Plantilla
      </button>
    </div>
  );
}
