export default function buildInsertQuery(entity) {
  const fields = Object.keys(entity).join(', ');
  const placeholders = Object.keys(entity).map(() => '?').join(', ');
  const values = Object.values(entity);

  return {
    fields: fields,
    placeholders: placeholders,
    values: values,
  };
}