import { storage } from './storage';
import { createId } from '../utils/id';

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export const api = {
  listVehicles() {
    return sortByDateDesc(storage.getVehicles());
  },
  getVehicleById(id) {
    return storage.getVehicles().find((vehicle) => vehicle.id === id) ?? null;
  },
  createVehicle(input) {
    const vehicles = storage.getVehicles();
    const newVehicle = {
      ...input,
      id: createId('veh'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vehicles.push(newVehicle);
    storage.saveVehicles(vehicles);
    return newVehicle;
  },
  updateVehicle(id, input) {
    const vehicles = storage.getVehicles();
    const index = vehicles.findIndex((vehicle) => vehicle.id === id);
    if (index < 0) return null;

    vehicles[index] = {
      ...vehicles[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    storage.saveVehicles(vehicles);
    return vehicles[index];
  },
  deleteVehicle(id, { convertLinkedPartsToIndependent = true } = {}) {
    const vehicles = storage.getVehicles().filter((vehicle) => vehicle.id !== id);
    storage.saveVehicles(vehicles);

    if (convertLinkedPartsToIndependent) {
      const parts = storage.getParts().map((part) =>
        part.vehicleId === id
          ? {
              ...part,
              vehicleId: '',
              updatedAt: new Date().toISOString(),
            }
          : part,
      );
      storage.saveParts(parts);
    }
  },
  listParts() {
    return sortByDateDesc(storage.getParts());
  },
  listPartsByVehicleId(vehicleId) {
    return storage.getParts().filter((part) => part.vehicleId === vehicleId);
  },
  getPartById(id) {
    return storage.getParts().find((part) => part.id === id) ?? null;
  },
  createPart(input) {
    const parts = storage.getParts();
    const newPart = {
      ...input,
      id: createId('prt'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    parts.push(newPart);
    storage.saveParts(parts);
    return newPart;
  },
  updatePart(id, input) {
    const parts = storage.getParts();
    const index = parts.findIndex((part) => part.id === id);
    if (index < 0) return null;

    parts[index] = {
      ...parts[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    storage.saveParts(parts);
    return parts[index];
  },
  deletePart(id) {
    const parts = storage.getParts().filter((part) => part.id !== id);
    storage.saveParts(parts);
  },
};
