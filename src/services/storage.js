const STORAGE_KEYS = {
  vehicles: 'fv_vehicles',
  parts: 'fv_parts',
};

function readList(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getVehicles() {
    return readList(STORAGE_KEYS.vehicles);
  },
  saveVehicles(vehicles) {
    writeList(STORAGE_KEYS.vehicles, vehicles);
  },
  getParts() {
    return readList(STORAGE_KEYS.parts);
  },
  saveParts(parts) {
    writeList(STORAGE_KEYS.parts, parts);
  },
};
