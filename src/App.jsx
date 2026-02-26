import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { VehiclesPage } from './pages/VehiclesPage';
import { VehicleFormPage } from './pages/VehicleFormPage';
import { VehicleDetailsPage } from './pages/VehicleDetailsPage';
import { PartsPage } from './pages/PartsPage';
import { PartFormPage } from './pages/PartFormPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/vehicles" replace />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="vehicles/new" element={<VehicleFormPage />} />
        <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
        <Route path="vehicles/:id/edit" element={<VehicleFormPage />} />
        <Route path="parts" element={<PartsPage />} />
        <Route path="parts/new" element={<PartFormPage />} />
        <Route path="parts/:id/edit" element={<PartFormPage />} />
        <Route path="independent-parts" element={<PartsPage onlyIndependent />} />
      </Route>
    </Routes>
  );
}