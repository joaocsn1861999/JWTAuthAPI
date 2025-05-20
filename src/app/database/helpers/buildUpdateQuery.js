export default function buildUpdateQuery(entityData) {
  const keys = Object.keys(entityData);

  const fields = keys.map((key) => `${key} = ?`).join(', ');
  const values = keys.map((key) => entityData[key]);

  return {
    fields,
    values,
  };
}