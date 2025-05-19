"use client";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date";

interface FieldOption {
  label: string;
  value: string;
}

interface Field {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: FieldOption[]; // Solo si type === 'select' o 'radio'
}

export default function FormBuilder() {
  const [fields, setFields] = useState<Field[]>([]);
  const [newField, setNewField] = useState<Omit<Field, "id">>({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: [],
  });

  const handleAddField = () => {
    if (!newField.name || !newField.label) {
      alert("Completa el nombre y la etiqueta del campo");
      return;
    }

    setFields([...fields, { ...newField, id: uuidv4() }]);
    setNewField({
      name: "",
      label: "",
      type: "text",
      required: false,
      options: [],
    });
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleAddOption = () => {
    const label = prompt("Etiqueta de la opción:");
    const value = prompt("Valor de la opción:");
    if (label && value) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), { label, value }],
      });
    }
  };

  const handleSaveTemplate = () => {
    const plantilla = {
      name: "Plantilla Inspección SST", // Puedes agregar un input si quieres
      fieldsDefinition: fields,
    };

    console.log("Plantilla generada:", JSON.stringify(plantilla, null, 2));
    alert("Plantilla guardada en consola.");
    // Aquí podrías hacer un fetch/axios para enviar la plantilla al backend
  };

  return (
    <div className="max-w-2xl p-4 m-4 mx-auto border rounded shadow-md">
      <h2 className="mb-4 text-xl font-bold text-center">
        Crear nueva plantilla
      </h2>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre técnico"
          value={newField.name}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
          className="p-2 border"
        />
        <input
          type="text"
          placeholder="Etiqueta (label)"
          value={newField.label}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
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
          <option value="text">Texto</option>
          <option value="number">Número</option>
          <option value="textarea">Área de texto</option>
          <option value="select">Seleccionable</option>
          <option value="radio">Radio</option>
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
          Requerido
        </label>
        {(newField.type === "select" || newField.type === "radio") && (
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
              <li key={i}>
                {opt.label} ({opt.value})
              </li>
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
              <strong>{field.label}</strong> ({field.name}) - {field.type}
              {field.required ? " *" : ""}
            </span>
            <button
              className="text-sm text-red-600"
              onClick={() => handleRemoveField(field.id)}
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
