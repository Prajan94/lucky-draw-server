const pool = require('../config/db-config');
const { createGraphQLError } = require('../common/errorService');
const { validatePlayerInput } = require('../common/validationService');
const logger = require('../common/loggerService');
const Player = require('../models/player');

async function getPlayers() {
  try {
    const res = await pool.query('SELECT * FROM players ORDER BY score DESC');
    return res.rows.map(row => new Player({
      id: row.id,
      name: row.name,
      title: row.title,
      score: row.score,
      lastUpdated: row.last_updated ? row.last_updated.toISOString() : null,
      userId: row.user_id
    }));
  } catch (err) {
    logger.logError('Error fetching getPlayers:', err);
    throw createGraphQLError('Failed to load getPlayers', 'INTERNAL_SERVER_ERROR');
  }
}

async function getLeaderBoard() {
  try {
    const res = await pool.query('SELECT * FROM players ORDER BY score DESC LIMIT 10');
    return res.rows.map(row => new Player({
      id: row.id,
      name: row.name,
      title: row.title,
      score: row.score,
      lastUpdated: row.last_updated ? row.last_updated.toISOString() : null,
      userId: row.user_id
    }));
  } catch (err) {
    logger.logError('Error fetching leaderboard:', err);
    throw createGraphQLError('Failed to load leaderboard', 'INTERNAL_SERVER_ERROR');
  }
}

async function addPlayer(name, score) {
  try {
    validatePlayerInput({ name, score });

    const res = await pool.query(
      `INSERT INTO players (name, title, score, user_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, '', score, 2]
    );

    return new Player({
      id: res.rows[0].id,
      name: res.rows[0].name,
      title: res.rows[0].title,
      score: res.rows[0].score,
      lastUpdated: res.rows[0].last_updated ? res.rows[0].last_updated.toISOString() : null,
      userId: res.rows[0].user_id
    });
  } catch (err) {
    logger.logError('Error adding player:', err);
    if (err.extensions?.code) throw err; // propagate known GraphQLError
    throw createGraphQLError('Failed to add player', 'INTERNAL_SERVER_ERROR');
  }
}

async function updatePlayer(id, name, score) {
  try {
    validatePlayerInput({ name, score });

    const res = await pool.query(
      `UPDATE players SET name=$2, score=$3, last_updated=NOW()
       WHERE id=$1 RETURNING *`,
      [id, name, score]
    );

    if (res.rows.length === 0) {
      throw createGraphQLError('Player not found', 'NOT_FOUND');
    }

    const player = res.rows[0];
    return new Player({
      id: player.id,
      name: player.name,
      title: player.title,
      score: player.score,
      lastUpdated: player.last_updated ? player.last_updated.toISOString() : null,
      userId: player.user_id
    });
  } catch (err) {
    logger.logError('Error updating player:', err);
    if (err.extensions?.code) throw err;
    throw createGraphQLError('Failed to update player', 'INTERNAL_SERVER_ERROR');
  }
}

async function deletePlayer(id) {
  try {

    const res = await pool.query(`DELETE FROM players WHERE id=$1 RETURNING id`, [id]);
    if (res.rowCount === 0) {
      throw createGraphQLError('Player not found', 'NOT_FOUND');
    }
    return true;
  } catch (err) {
    logger.logError('Error deleting player:', err);
    if (err.extensions?.code) throw err;
    throw createGraphQLError('Failed to delete player', 'INTERNAL_SERVER_ERROR');
  }
}

module.exports = {
  getLeaderBoard,
  getPlayers,
  addPlayer,
  updatePlayer,
  deletePlayer
};

  