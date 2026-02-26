import { useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PartForm } from '../components/PartForm';
import { api } from '../services/api';
import { persistPhotoChanges } from '../utils/photos';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function PartFormPage() {
  const { id } = useParams();
  const query = useQuery();
  const navigate = useNavigate();
  const vehicles = api.listVehicles();

  const existing = useMemo(() => (id ? api.getPartById(id) : null), [id]);
  const preselectedVehicle = query.get('vehicleId') || '';

  const save = async (formData, photoState) => {
    const photos = await persistPhotoChanges(existing?.photos ?? [], photoState);
    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price: formData.price ? Number(formData.price) : null,
      photos,
    };

    if (existing) {
      api.updatePart(existing.id, payload);
    } else {
      api.createPart(payload);
    }

    navigate('/parts');
  };

  if (id && !existing) {
    return <p>Peça não encontrada.</p>;
  }

  const initialData = existing || { vehicleId: preselectedVehicle };

  return (
    <section>
      <h1>{existing ? 'Editar peça' : 'Nova peça'}</h1>
      <PartForm
        initialData={initialData}
        vehicles={vehicles}
        onSubmit={save}
        onCancel={() => navigate(-1)}
        lockVehicleId={!existing && !!preselectedVehicle}
      />
    </section>
  );
}
