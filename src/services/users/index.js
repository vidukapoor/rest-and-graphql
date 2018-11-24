import { writePool, readPool } from '../../db/mysql';

export async function getAllUsersService({ search, limit, offset }) {
  let getQuery = 'SELECT * FROM users u';
  const values = [];

  if (search) {
    getQuery += ' WHERE u.name LIKE "%?%" ';
    values.push(search);
  }

  if (limit && offset) {
    getQuery += ' LIMIT ? OFFSET ?';
    values.push(parseInt(limit, 10), parseInt(offset, 10));
  }

  const result = await readPool.query(getQuery, values);
  return result[0];
}

export async function createUsersService({ name, email, address }) {
  const result = await writePool.query(
    'INSERT INTO users (name, email, address) VALUES (?, ?, ?)',
    [name, email, address],
  );
  if (!result[0].affectedRows) {
    return {};
  }
  return {
    userId: result[0].insertId,
    name,
    email,
    address,
  };
}

export async function updateUsersService({
  userId, name, email, address,
}) {
  let updateQuery = 'UPDATE users SET';
  const updates = [];
  const updateValues = [];

  if (name) {
    updates.push(' name = ? ');
    updateValues.push(name);
  }

  if (email) {
    updates.push(' email = ? ');
    updateValues.push(email);
  }

  if (address) {
    updates.push(' address = ? ');
    updateValues.push(address);
  }

  updateQuery = `${updateQuery} ${updates.join()}  WHERE id = ?`;
  await writePool.query(updateQuery, [...updateValues, userId]);
  return {
    userId,
    name,
    email,
    address,
  };
}

export async function deleteUsersService({ userIdCollection }) {
  if (!Array.isArray(userIdCollection)) return;
  await writePool.query('UPDATE users SET is_active = 0 WHERE id IN (?)', [userIdCollection]);
}