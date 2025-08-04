const pool = require('../config/db-config');
const logger = require('../common/loggerService');
const { createGraphQLError } = require('../common/errorService');
const User = require('../models/user');

async function getUserRole(username) {
  try {
    if (!username || typeof username !== 'string') {
      throw createGraphQLError('Invalid username input', 'BAD_USER_INPUT');
    }

    const res = await pool.query(
      `SELECT users.id, users.username, roles.id AS role_id, roles.name AS role_name
       FROM users
       JOIN user_roles ON users.id = user_roles.user_id
       JOIN roles ON user_roles.role_id = roles.id
       WHERE users.username = $1`,
      [username]
    );

    if (res.rows.length === 0) {
      // Controlled business error
      throw createGraphQLError('User not found', 'NOT_FOUND');
    }

    const row = res.rows[0];
    return new User({
      id: row.id,
      username: row.username,
      role: { id: row.role_id, name: row.role_name }
    });

  } catch (error) {
    logger.logError('Error in getUserRole:', error);

    // Only wrap unexpected errors
    if (error?.extensions?.code) {
      // already a GraphQL error thrown earlier
      throw error;
    }

    // unexpected, internal error
    throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = { getUserRole };
