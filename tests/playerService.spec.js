const playerService = require('../services/playerService');
const pool = require('../config/db-config');
const errorService = require('../common/errorService');
const logger = require('../common/loggerService');
const Player = require('../models/player');
const validationService = require('../common/validationService');

jest.mock('../config/db-config');
jest.mock('../common/errorService');
jest.mock('../common/loggerService');
jest.mock('../common/validationService');

describe('playerService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getPlayers', () => {
    it('should return list of players', async () => {
      const rows = [{ id: 1, name: 'Alice', score: 100, last_updated: new Date(), title: '', user_id: 2 }];
      pool.query.mockResolvedValue({ rows });

      const result = await playerService.getPlayers();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Player);
    });

    it('should log and throw GraphQLError on DB error', async () => {
      pool.query.mockRejectedValue(new Error('DB fail'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL error'));

      await expect(playerService.getPlayers()).rejects.toThrow('GraphQL error');
      expect(logger.logError).toHaveBeenCalledWith('Error fetching getPlayers:', expect.any(Error));
    });
  });

  describe('getLeaderBoard', () => {
    it('should return top players', async () => {
      pool.query.mockResolvedValue({ rows: [{ id: 1, name: 'Bob', score: 200, last_updated: new Date(), title: '', user_id: 2 }] });

      const result = await playerService.getLeaderBoard();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Player);
    });

    it('should handle DB error', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL error'));

      await expect(playerService.getLeaderBoard()).rejects.toThrow('GraphQL error');
      expect(logger.logError).toHaveBeenCalledWith('Error fetching leaderboard:', expect.any(Error));
    });
  });

  describe('addPlayer', () => {
    it('should add and return player', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      const row = { id: 1, name: 'Charlie', score: 150, last_updated: new Date(), title: '', user_id: 2 };
      pool.query.mockResolvedValue({ rows: [row] });

      const result = await playerService.addPlayer('Charlie', 150);
      expect(result).toBeInstanceOf(Player);
    });

    it('should log and throw on unknown error', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      pool.query.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL error'));

      await expect(playerService.addPlayer('Charlie', 150)).rejects.toThrow('GraphQL error');
      expect(logger.logError).toHaveBeenCalledWith('Error adding player:', expect.any(Error));
    });
  });

  describe('updatePlayer', () => {
    it('should update and return player', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      const row = { id: 1, name: 'NewName', score: 200, last_updated: new Date(), title: '', user_id: 2 };
      pool.query.mockResolvedValue({ rows: [row] });

      const result = await playerService.updatePlayer(1, 'NewName', 200);
      expect(result).toBeInstanceOf(Player);
    });

    it('should throw NOT_FOUND if player not found', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      pool.query.mockResolvedValue({ rows: [] });
      errorService.createGraphQLError.mockReturnValue(new Error('Player not found'));

      await expect(playerService.updatePlayer(1, 'NewName', 200)).rejects.toThrow('Player not found');
    });

    it('should log and throw on unknown error', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      pool.query.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL error'));

      await expect(playerService.updatePlayer(1, 'NewName', 200)).rejects.toThrow('GraphQL error');
      expect(logger.logError).toHaveBeenCalledWith('Error updating player:', expect.any(Error));
    });
  });

  describe('deletePlayer', () => {
    it('should delete player and return true', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });
      const result = await playerService.deletePlayer(1);
      expect(result).toBe(true);
    });

    it('should throw NOT_FOUND if player not found', async () => {
      pool.query.mockResolvedValue({ rowCount: 0 });
      errorService.createGraphQLError.mockReturnValue(new Error('Player not found'));

      await expect(playerService.deletePlayer(1)).rejects.toThrow('Player not found');
    });

    it('should log and throw on unknown error', async () => {
      pool.query.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL error'));

      await expect(playerService.deletePlayer(1)).rejects.toThrow('GraphQL error');
      expect(logger.logError).toHaveBeenCalledWith('Error deleting player:', expect.any(Error));
    });
  });
});
