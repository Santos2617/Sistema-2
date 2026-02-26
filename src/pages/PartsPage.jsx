import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { formatDate } from '../utils/date';
import { getImage } from '../services/imageDb';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function PartsPage({ onlyIndependent = false }) {
  const [parts, setParts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [linkFilter, setLinkFilter] = useState(onlyIndependent ? 'independent' : 'all');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [thumbs, setThumbs] = useState({});
  const navigate = useNavigate();
  const query = useQuery();

  useEffect(() => {
    setParts(api.listParts());
    setVehicles(api.listVehicles());
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadThumbs() {
      const entries = await Promise.all(
        parts.map(async (part) => {
          const firstPhoto = part.photos?.[0];
          if (!firstPhoto) return [part.id, ''];
          const image = await getImage(firstPhoto.id);
          return [part.id, image?.dataUrl || ''];
        }),
      );
      if (mounted) setThumbs(Object.fromEntries(entries));
    }
    loadThumbs();
    return () => {
      mounted = false;
    };
  }, [parts]);

  useEffect(() => {
    if (onlyIndependent) setLinkFilter('independent');
  }, [onlyIndependent]);

  const filtered = useMemo(() => {
    let result = parts.filter((part) =>
      [part.name, part.category].join(' ').toLowerCase().includes(search.toLowerCase()),
    );

    if (linkFilter === 'independent') result = result.filter((part) => !part.vehicleId);
    if (linkFilter === 'linked') result = result.filter((part) => !!part.vehicleId);
    if (vehicleFilter) result = result.filter((part) => part.vehicleId === vehicleFilter);

    if (sortBy === 'az') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === 'za') result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === 'oldest') result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === 'newest') result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [parts, search, sortBy, linkFilter, vehicleFilter]);

  const deletePart = (part) => {
    if (!window.confirm(`Excluir peça ${part.name}?`)) return;
    api.deletePart(part.id);
    setParts(api.listParts());
  };

  const initialVehicle = query.get('vehicleId');

  return (
    <section>
      <div className="page-header">
        <h1>{onlyIndependent ? 'Peças Independentes' : 'Peças'}</h1>
        <button
          onClick={() =>
            navigate(initialVehicle ? `/parts/new?vehicleId=${initialVehicle}` : '/parts/new')
          }
        >
          Nova peça
        </button>
      </div>

      <div className="toolbar multi">
        <input placeholder="Buscar por nome/categoria" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Mais recente</option>
          <option value="oldest">Mais antigo</option>
          <option value="az">A-Z</option>
          <option value="za">Z-A</option>
        </select>
        <select value={linkFilter} onChange={(e) => setLinkFilter(e.target.value)} disabled={onlyIndependent}>
          <option value="all">Todas</option>
          <option value="independent">Somente independentes</option>
          <option value="linked">Somente vinculadas</option>
        </select>
        <select value={vehicleFilter} onChange={(e) => setVehicleFilter(e.target.value)}>
          <option value="">Filtrar por veículo</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.brand} {vehicle.model}
            </option>
          ))}
        </select>
      </div>

      <div className="card-grid">
        {filtered.map((part) => (
          <article className="card" key={part.id}>
            <img src={thumbs[part.id] || '/placeholder.svg'} alt={part.name} className="card-photo" />
            <h3>{part.name}</h3>
            <p>
              {part.category} • {part.condition} • Qtde: {part.quantity}
            </p>
            <p>Cadastro: {formatDate(part.createdAt)}</p>
            <p>
              Vínculo:{' '}
              {part.vehicleId
                ? vehicles.find((vehicle) => vehicle.id === part.vehicleId)?.model ?? 'Veículo removido'
                : 'Independente'}
            </p>
            <div className="inline-actions">
              <Link to={`/parts/${part.id}/edit`}>Editar</Link>
              <button className="danger-text" onClick={() => deletePart(part)}>
                Excluir
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
