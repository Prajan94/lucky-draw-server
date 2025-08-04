const playerService = require('../services/playerService');
const userService = require('../services/userService');
const { validatePlayerInput } = require('../common/validationService');
const { createGraphQLError } = require('../common/errorService');
const loggerService = require('../common/loggerService');

const resolvers = {
  Query: {
    getPlayers: async () => {
      try {
        return await playerService.getPlayers();
      } catch (error) {
        loggerService.logError('getPlayers failed:', error);
        throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
  },
    getLeaderBoard: async () => {
      try {
        return await playerService.getLeaderBoard();
      } catch (error) {
        loggerService.logError('getLeaderBoard failed:', error);
        throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
    getUserRole: async (_, { username }) => {
      try {
        return await userService.getUserRole(username);
      } catch (error) {
        loggerService.logError('getUserRole failed:', error);
    
        // ✅ if it's already a GraphQLError (has extensions.code), rethrow as is:
        if (error instanceof Error && error.extensions?.code) {
          throw error;
        }
    
        // else, unknown error → throw generic internal
        throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    }
  },
  Mutation: {
    addPlayer: async (_, { name, score }) => {
      const errors = validatePlayerInput({ name, score });
      if (errors.length > 0) {
        throw createGraphQLError(errors, 'BAD_USER_INPUT', 'Validation failed');
      }
      try {
        return await playerService.addPlayer(name, score);
      } catch (error) {
        loggerService.logError('addPlayer failed:', error);
        if (error instanceof Error && error.extensions?.code) {
          throw error; // rethrow known GraphQLError
        }
        throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
    
    deletePlayer: async (_, { id }) => {
      const errors = validatePlayerInput({ id });
      if (errors.length > 0) {
        throw createGraphQLError(errors, 'BAD_USER_INPUT', 'Validation failed');
      }
      try {
        return await playerService.deletePlayer(id);
      } catch (error) {
        loggerService.logError('deletePlayer failed:', error);
        if (error instanceof Error && error.extensions?.code) {
          throw error;
        }
        throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    },
    
    updatePlayer: async (_, { id, name, score }) => {
      const errors = validatePlayerInput({ id, name, score });
      if (errors.length > 0) {
        throw createGraphQLError(errors, 'BAD_USER_INPUT', 'Validation failed');
      }
      try {
        return await playerService.updatePlayer(id, name, score);
      } catch (error) {
        loggerService.logError('updatePlayer failed:', error);
        if (error instanceof Error && error.extensions?.code) {
          throw error;
        }
        throw createGraphQLError('Internal server error', 'INTERNAL_SERVER_ERROR');
      }
    }
  }    
};

module.exports = { resolvers };
