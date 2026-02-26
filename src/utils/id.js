export function createId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}
