import { useState } from 'react';
import { PhotoUploader } from './PhotoUploader';

const initialState = {
  name: '',
  category: '',
  condition: 'usada',
  quantity: 1,
  price: '',
  location: '',
  notes: '',
  vehicleId: '',
};

export function PartForm({ initialData, vehicles, onSubmit, onCancel, lockVehicleId = false }) {
  const [form, setForm] = useState({ ...initialState, ...initialData });
  const [photoState, setPhotoState] = useState({ existingPhotos: initialData?.photos ?? [], newPhotos: [] });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.name || !form.category || !form.condition || form.quantity === '' || form.quantity === null) {
      alert('Preencha os campos obrigatórios da peça.');
      return;
    }

    if (Number(form.quantity) < 0) {
      alert('Quantidade não pode ser negativa.');
      return;
    }

    onSubmit(form, photoState);
  };

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Nome*
        <input name="name" value={form.name} onChange={handleChange} />
      </label>
      <label>
        Categoria*
        <input name="category" value={form.category} onChange={handleChange} />
      </label>
      <label>
        Condição*
        <select name="condition" value={form.condition} onChange={handleChange}>
          <option value="nova">Nova</option>
          <option value="usada">Usada</option>
          <option value="sucata">Sucata</option>
        </select>
      </label>
      <label>
        Quantidade*
        <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} />
      </label>
      <label>
        Preço
        <input type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} />
      </label>
      <label>
        Localização
        <input name="location" value={form.location} onChange={handleChange} />
      </label>
      <label className="full-width">
        Veículo vinculado
        <select name="vehicleId" value={form.vehicleId || ''} onChange={handleChange} disabled={lockVehicleId}>
          <option value="">Sem vínculo</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.brand} {vehicle.model} ({vehicle.year})
            </option>
          ))}
        </select>
      </label>
      <label className="full-width">
        Observações
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={4} />
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
