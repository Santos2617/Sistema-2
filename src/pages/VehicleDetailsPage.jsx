import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { formatDate } from '../utils/date';
import { getImage } from '../services/imageDb';

export function VehicleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [linkedParts, setLinkedParts] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);

  useEffect(() => {
    const found = api.getVehicleById(id);
    setVehicle(found);
    setLinkedParts(api.listPartsByVehicleId(id));
  }, [id]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!vehicle) return;
      const imgs = await Promise.all(
        (vehicle.photos ?? []).map(async (photo) => {
          const record = await getImage(photo.id);
          return record?.dataUrl || '';
        }),
      );
      if (mounted) setPhotoUrls(imgs.filter(Boolean));
    }
    load();

    return () => {
      mounted = false;
    };
  }, [vehicle]);

  if (!vehicle) return <p>Veículo não encontrado.</p>;

  return (
    <section>
      <div className="page-header">
        <h1>
          {vehicle.brand} {vehicle.model}
        </h1>
        <div className="inline-actions">
          <button onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}>Editar</button>
          <button className="secondary" onClick={() => navigate('/vehicles')}>
            Voltar
          </button>
        </div>
      </div>

      <div className="details-box">
        <p>Tipo: {vehicle.type}</p>
        <p>Ano: {vehicle.year}</p>
        <p>Placa: {vehicle.plate || '-'}</p>
        <p>Cor: {vehicle.color || '-'}</p>
        <p>Cadastro: {formatDate(vehicle.createdAt)}</p>
      </div>

      <div className="thumb-grid">
        {photoUrls.length === 0 ? (
          <p>Sem fotos.</p>
        ) : (
          photoUrls.map((url, idx) => <img key={idx} src={url} alt={`foto-${idx}`} className="thumb" />)
        )}
      </div>

      <div className="page-header">
        <h2>Peças vinculadas</h2>
        <Link to={`/parts/new?vehicleId=${vehicle.id}`}>Adicionar peça para este veículo</Link>
      </div>
      <ul className="list">
        {linkedParts.length === 0 ? (
          <li>Nenhuma peça vinculada.</li>
        ) : (
          linkedParts.map((part) => (
            <li key={part.id}>
              {part.name} ({part.category}) - Quantidade: {part.quantity}{' '}
              <Link to={`/parts/${part.id}/edit`}>Editar</Link>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
