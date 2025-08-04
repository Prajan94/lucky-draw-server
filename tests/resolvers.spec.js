const { resolvers } = require('../api/resolvers');
const playerService = require('../services/playerService');
const userService = require('../services/userService');
const validationService = require('../common/validationService');
const errorService = require('../common/errorService');
const loggerService = require('../common/loggerService');

jest.mock('../services/playerService');
jest.mock('../services/userService');
jest.mock('../common/validationService');
jest.mock('../common/errorService');
jest.mock('../common/loggerService');

describe('resolvers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Mutation.deletePlayer', () => {
    it('should delete player successfully', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      playerService.deletePlayer.mockResolvedValue(true);
      const result = await resolvers.Mutation.deletePlayer(null, { id: 1 });
      expect(result).toBe(true);
      expect(playerService.deletePlayer).toHaveBeenCalledWith(1);
    });

    it('should fail validation', async () => {
      validationService.validatePlayerInput.mockReturnValue(['id required']);
      errorService.createGraphQLError.mockReturnValue(new Error('Validation failed'));
      await expect(resolvers.Mutation.deletePlayer(null, { id: null })).rejects.toThrow('Validation failed');
    });

    it('should catch unknown error', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      playerService.deletePlayer.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL internal error'));
      await expect(resolvers.Mutation.deletePlayer(null, { id: 1 })).rejects.toThrow('GraphQL internal error');
      expect(loggerService.logError).toHaveBeenCalledWith('deletePlayer failed:', expect.any(Error));
    });
  });

  describe('Mutation.updatePlayer', () => {
    it('should update player successfully', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      const player = { id: 2, name: 'New', score: 200 };
      playerService.updatePlayer.mockResolvedValue(player);
      const result = await resolvers.Mutation.updatePlayer(null, { id: 2, name: 'New', score: 200 });
      expect(result).toEqual(player);
      expect(playerService.updatePlayer).toHaveBeenCalledWith(2, 'New', 200);
    });

    it('should fail validation', async () => {
      validationService.validatePlayerInput.mockReturnValue(['name required']);
      errorService.createGraphQLError.mockReturnValue(new Error('Validation failed'));
      await expect(resolvers.Mutation.updatePlayer(null, { id: 2, name: '', score: 200 })).rejects.toThrow('Validation failed');
    });

    it('should catch unknown error', async () => {
      validationService.validatePlayerInput.mockReturnValue([]);
      playerService.updatePlayer.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL internal error'));
      await expect(resolvers.Mutation.updatePlayer(null, { id: 2, name: 'New', score: 200 })).rejects.toThrow('GraphQL internal error');
      expect(loggerService.logError).toHaveBeenCalledWith('updatePlayer failed:', expect.any(Error));
    });
  });

  describe('Query.getLeaderBoard', () => {
    it('should return leaderboard', async () => {
      const leaderboard = [{ id: 1, name: 'Alice', score: 300 }];
      playerService.getLeaderBoard.mockResolvedValue(leaderboard);
      const result = await resolvers.Query.getLeaderBoard();
      expect(result).toEqual(leaderboard);
    });

    it('should handle error', async () => {
      playerService.getLeaderBoard.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL internal error'));
      await expect(resolvers.Query.getLeaderBoard()).rejects.toThrow('GraphQL internal error');
      expect(loggerService.logError).toHaveBeenCalledWith('getLeaderBoard failed:', expect.any(Error));
    });
  });

  describe('Query.getUserRole', () => {
    it('should return user role', async () => {
      const user = { id: 1, username: 'bob', role: { id: 1, name: 'admin' } };
      userService.getUserRole.mockResolvedValue(user);
      const result = await resolvers.Query.getUserRole(null, { username: 'bob' });
      expect(result).toEqual(user);
      expect(userService.getUserRole).toHaveBeenCalledWith('bob');
    });

    it('should rethrow known GraphQLError', async () => {
      const gqlErr = new Error('Known error');
      gqlErr.extensions = { code: 'SOME_CODE' };
      userService.getUserRole.mockRejectedValue(gqlErr);
      await expect(resolvers.Query.getUserRole(null, { username: 'bob' })).rejects.toThrow('Known error');
    });

    it('should catch unknown error', async () => {
      userService.getUserRole.mockRejectedValue(new Error('DB error'));
      errorService.createGraphQLError.mockReturnValue(new Error('GraphQL internal error'));
      await expect(resolvers.Query.getUserRole(null, { username: 'bob' })).rejects.toThrow('GraphQL internal error');
      expect(loggerService.logError).toHaveBeenCalledWith('getUserRole failed:', expect.any(Error));
    });
  });
});
