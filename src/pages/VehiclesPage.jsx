import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatDate } from '../utils/date';
import { getImage } from '../services/imageDb';

export function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [thumbs, setThumbs] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const list = api.listVehicles();
    setVehicles(list);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadThumbs() {
      const entries = await Promise.all(
        vehicles.map(async (vehicle) => {
          const firstPhoto = vehicle.photos?.[0];
          if (!firstPhoto) return [vehicle.id, ''];
          const image = await getImage(firstPhoto.id);
          return [vehicle.id, image?.dataUrl || ''];
        }),
      );
      if (mounted) setThumbs(Object.fromEntries(entries));
    }

    loadThumbs();
    return () => {
      mounted = false;
    };
  }, [vehicles]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    let result = vehicles.filter((v) =>
      [v.brand, v.model, v.plate].join(' ').toLowerCase().includes(term),
    );

    if (sortBy === 'az') result = [...result].sort((a, b) => a.model.localeCompare(b.model));
    if (sortBy === 'za') result = [...result].sort((a, b) => b.model.localeCompare(a.model));
    if (sortBy === 'oldest') result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [vehicles, search, sortBy]);

  const deleteVehicle = (vehicle) => {
    const ok = window.confirm(
      `Excluir ${vehicle.brand} ${vehicle.model}? Peças vinculadas serão transformadas em independentes automaticamente.`,
    );
    if (!ok) return;
    api.deleteVehicle(vehicle.id, { convertLinkedPartsToIndependent: true });
    setVehicles(api.listVehicles());
  };

  return (
    <section>
      <div className="page-header">
        <h1>Veículos</h1>
        <button onClick={() => navigate('/vehicles/new')}>Novo veículo</button>
      </div>

      <div className="toolbar">
        <input
          placeholder="Buscar por marca/modelo/placa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Mais recente</option>
          <option value="oldest">Mais antigo</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
      </div>

      <div className="card-grid">
        {filtered.map((vehicle) => (
          <article className="card" key={vehicle.id}>
            <img src={thumbs[vehicle.id] || '/placeholder.svg'} alt={vehicle.model} className="card-photo" />
            <h3>
              {vehicle.brand} {vehicle.model}
            </h3>
            <p>
              {vehicle.type} • {vehicle.year} • {vehicle.plate || 'Sem placa'}
            </p>
            <p>Cadastrado em: {formatDate(vehicle.createdAt)}</p>
            <div className="inline-actions">
              <Link to={`/vehicles/${vehicle.id}`}>Detalhes</Link>
              <Link to={`/vehicles/${vehicle.id}/edit`}>Editar</Link>
              <button className="danger-text" onClick={() => deleteVehicle(vehicle)}>
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
