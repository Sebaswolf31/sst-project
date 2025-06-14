'use client';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import {
  FieldType,
  InspectionTypeForm,
  CreateInspectionTemplateDto,
  IInspection,
} from '../interface';
import { createInpectionTemplate } from '../services/inspectiontemplates';

export default function FormBuilder() {
  const [inspectionName, setInspectionName] = useState('');
  const [formType, setFormType] = useState<InspectionTypeForm>(
    InspectionTypeForm.WORK_AREAS,
  );
  const [fields, setFields] = useState<IInspection[]>([]);
  const [newField, setNewField] = useState<IInspection>({
    fieldName: '',
    displayName: '',
    date: '' as unknown as Date,
    inspectionType: InspectionTypeForm.WORK_AREAS,
    type: FieldType.Texto,
    required: false,
    options: [],
  });

  const handleAddField = () => {
    if (!newField.fieldName) {
      toast.error('Completa el nombre del campo');
      return;
    }
    setFields([...fields, { ...newField, id: uuidv4() }]);
    setNewField({
      fieldName: '',
      displayName: '',
      date: '' as unknown as Date,
      inspectionType: InspectionTypeForm.WORK_AREAS,
      type: FieldType.Texto,
      required: false,
      options: [],
    });
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleAddOption = () => {
    const label = prompt('Etiqueta de la opción:');
    if (label) {
      setNewField({
        ...newField,
        options: [...(newField.options || []), label],
      });
    }
  };

  const handleSaveTemplate = async () => {
    try {
      // Mapeo simple sin usar destructuring del id
      const cleanFields = fields.map((f) => ({
        fieldName: f.fieldName,
        displayName: f.displayName,
        type: f.type,
        required: f.required,
        options: f.options,
      }));

      const payload: CreateInspectionTemplateDto = {
        name: inspectionName.trim(),
        fields: cleanFields,
        formType,
      };

      await createInpectionTemplate(payload);
      toast.success('Plantilla guardada');

      // reset form
      setInspectionName('');
      setFormType(InspectionTypeForm.WORK_AREAS);
      setFields([]);
      setNewField({
        fieldName: '',
        displayName: '',
        date: '' as unknown as Date,
        inspectionType: InspectionTypeForm.WORK_AREAS,
        type: FieldType.Texto,
        required: false,
        options: [],
      });
    } catch (error) {
      // Usar tipo any en catch es innecesario; se maneja instancia de Error
      const message =
        error instanceof Error ? error.message : 'Error al guardar plantilla';
      toast.error(message);
    }
  };

  return (
    <div className='max-w-2xl p-4 m-4 mx-auto border rounded shadow-md'>
      <h2 className='mb-4 text-xl font-bold text-center'>
        Crear nueva plantilla
      </h2>

      <input
        className='w-full p-2 mb-4 border rounded'
        type='text'
        placeholder='Nombre de la plantilla'
        value={inspectionName}
        onChange={(e) => setInspectionName(e.target.value)}
      />

      {/* Select de FormType */}
      <select
        value={formType}
        onChange={(e) => setFormType(e.target.value as InspectionTypeForm)}
        className='w-full p-2 mb-4 border rounded'
      >
        <option value={InspectionTypeForm.WORK_AREAS}>
          Áreas y puestos de trabajo
        </option>
        <option value={InspectionTypeForm.MACHINERY}>
          Maquinaria y equipos
        </option>
        <option value={InspectionTypeForm.PROTECTIVE_EQUIPMENT}>
          Elementos de protección personal
        </option>
        <option value={InspectionTypeForm.MEDICAL}>
          Botiquines y camillas
        </option>
      </select>

      {/* Campos dinámicos */}
      <div className='grid grid-cols-2 gap-2 mb-4'>
        <input
          type='text'
          placeholder='Nombre del campo'
          value={newField.displayName}
          onChange={(e) =>
            setNewField({
              ...newField,
              displayName: e.target.value,
              fieldName: e.target.value,
            })
          }
          className='p-2 border rounded'
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
          className='p-2 border rounded'
        >
          <option value=''>Tipo de campo</option>
          <option value={FieldType.Texto}>Texto</option>
          <option value={FieldType.Numero}>Número</option>
          <option value={FieldType.Opciones}>Seleccionable</option>
          <option value={FieldType.Checkbox}>Checkbox</option>
          <option value={FieldType.Fecha}>Fecha</option>
        </select>

        <label className='flex items-center'>
          <input
            type='checkbox'
            checked={newField.required}
            onChange={(e) =>
              setNewField({ ...newField, required: e.target.checked })
            }
            className='mr-2'
          />
          Campo requerido
        </label>

        {newField.type === FieldType.Opciones && (
          <>
            {/* Botón para lanzar el prompt y agregar una nueva opción */}
            <button
              type='button'
              onClick={handleAddOption}
              className='col-span-2 p-2 text-white rounded bg-blueP'
            >
              Añadir opción
            </button>

            {/* Si ya hay opciones en el estado, las listamos aquí */}
            {newField.options && newField.options.length > 0 && (
              <ul className='col-span-2 pl-4 mt-2 mb-4 list-disc'>
                {newField.options.map((opt, idx) => (
                  <li key={idx} className='text-sm'>
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <button
        type='button'
        onClick={handleAddField}
        className='w-full p-2 mb-4 text-white rounded bg-blueP'
      >
        Añadir campo
      </button>

      {/* Listado de campos */}
      <ul className='mb-4'>
        {fields.map((f) => (
          <li key={f.id} className='flex justify-between items-center mb-2'>
            <span>
              {f.displayName} ({f.type})
            </span>
            <button
              onClick={() => handleRemoveField(f.id!)}
              className='text-red-600'
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      <button
        type='button'
        onClick={handleSaveTemplate}
        className='w-full px-4 py-2 text-white bg-green-600 rounded'
      >
        Guardar Plantilla
      </button>
    </div>
  );
}
