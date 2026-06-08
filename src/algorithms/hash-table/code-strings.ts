export const HASH_TABLE_INSERT_CODE = `function insert(table, value) {
  const bucketIndex = Math.abs(value % table.length);
  const bucket = table[bucketIndex];

  if (!bucket.includes(value)) {
    bucket.push(value);
  }

  return table;
}`;

export const HASH_TABLE_DELETE_CODE = `function remove(table, value) {
  const bucketIndex = Math.abs(value % table.length);
  const bucket = table[bucketIndex];
  const entryIndex = bucket.indexOf(value);

  if (entryIndex >= 0) {
    bucket.splice(entryIndex, 1);
  }

  return table;
}`;

export const HASH_TABLE_SEARCH_CODE = `function search(table, value) {
  const bucketIndex = Math.abs(value % table.length);
  const bucket = table[bucketIndex];

  return bucket.includes(value);
}`;

export const HASH_TABLE_TRAVERSE_CODE = `function traverse(table) {
  for (const bucket of table) {
    for (const value of bucket) {
      console.log(value);
    }
  }
}`;
