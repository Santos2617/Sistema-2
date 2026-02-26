import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VehicleForm } from '../components/VehicleForm';
import { api } from '../services/api';
import { persistPhotoChanges } from '../utils/photos';

export function VehicleFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const existing = useMemo(() => (id ? api.getVehicleById(id) : null), [id]);

  const save = async (formData, photoState) => {
    const photos = await persistPhotoChanges(existing?.photos ?? [], photoState);
    const payload = {
      ...formData,
      year: Number(formData.year),
      photos,
    };

    if (existing) {
      api.updateVehicle(existing.id, payload);
    } else {
      api.createVehicle(payload);
    }

    navigate('/vehicles');
  };

  if (id && !existing) {
    return <p>Veículo não encontrado.</p>;
  }

  return (
    <section>
      <h1>{existing ? 'Editar veículo' : 'Novo veículo'}</h1>
      <VehicleForm
        initialData={existing}
        onSubmit={save}
        onCancel={() => navigate(existing ? `/vehicles/${existing.id}` : '/vehicles')}
      />
    </section>
  );
}
