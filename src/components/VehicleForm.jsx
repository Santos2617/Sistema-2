import { useState } from 'react';
import { PhotoUploader } from './PhotoUploader';

const initialState = {
  type: 'carro',
  brand: '',
  model: '',
  year: '',
  plate: '',
  color: '',
};

export function VehicleForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...initialState, ...initialData });
  const [photoState, setPhotoState] = useState({ existingPhotos: initialData?.photos ?? [], newPhotos: [] });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.type || !form.brand || !form.model || !form.year) {
      alert('Preencha os campos obrigatórios do veículo.');
      return;
    }

    onSubmit(form, photoState);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Tipo*
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="carro">Carro</option>
          <option value="moto">Moto</option>
        </select>
      </label>
      <label>
        Marca*
        <input name="brand" value={form.brand} onChange={handleChange} />
      </label>
      <label>
        Modelo*
        <input name="model" value={form.model} onChange={handleChange} />
      </label>
      <label>
        Ano*
        <input name="year" type="number" min="1900" max="2100" value={form.year} onChange={handleChange} />
      </label>
      <label>
        Placa
        <input name="plate" value={form.plate} onChange={handleChange} />
      </label>
      <label>
        Cor
        <input name="color" value={form.color} onChange={handleChange} />
      </label>

      <div className="full-width">
        <p className="label">Fotos</p>
        <PhotoUploader existingPhotos={initialData?.photos ?? []} onChange={setPhotoState} />
      </div>

      <div className="actions full-width">
        <button type="submit">Salvar</button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
