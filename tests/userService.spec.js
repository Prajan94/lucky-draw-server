const userService = require('../services/userService');
const pool = require('../config/db-config');
const errorService = require('../common/errorService');
const logger = require('../common/loggerService');
const User = require('../models/user');

jest.mock('../config/db-config');
jest.mock('../common/errorService');
jest.mock('../common/loggerService');

describe('userService.getUserRole', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return user with role on success', async () => {
    const mockRow = { id: 1, username: 'alice', role_id: 2, role_name: 'admin' };
    pool.query.mockResolvedValue({ rows: [mockRow] });

    const user = await userService.getUserRole('alice');
    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(1);
    expect(user.username).toBe('alice');
    expect(user.role).toEqual({ id: 2, name: 'admin' });
  });

  it('should throw BAD_USER_INPUT if username invalid', async () => {
    const gqlErr = new Error('Invalid username');
    errorService.createGraphQLError.mockReturnValue(gqlErr);
    await expect(userService.getUserRole('')).rejects.toThrow('Invalid username');
    expect(errorService.createGraphQLError).toHaveBeenCalledWith('Invalid username input', 'BAD_USER_INPUT');
  });

  it('should throw NOT_FOUND if user not found', async () => {
    pool.query.mockResolvedValue({ rows: [] });
    const gqlErr = new Error('User not found');
    gqlErr.extensions = { code: 'NOT_FOUND' };
    errorService.createGraphQLError.mockReturnValue(gqlErr);

    await expect(userService.getUserRole('missing')).rejects.toThrow('User not found');
    expect(errorService.createGraphQLError).toHaveBeenCalledWith('User not found', 'NOT_FOUND');
  });

  it('should throw INTERNAL_SERVER_ERROR on unexpected db error', async () => {
    pool.query.mockRejectedValue(new Error('db fail'));
    const gqlErr = new Error('Internal server error');
    errorService.createGraphQLError.mockReturnValue(gqlErr);

    await expect(userService.getUserRole('alice')).rejects.toThrow('Internal server error');
    expect(logger.logError).toHaveBeenCalledWith('Error in getUserRole:', expect.any(Error));
  });

  it('should rethrow known GraphQLError', async () => {
    const gqlErr = new Error('Known');
    gqlErr.extensions = { code: 'SOME_CODE' };
    pool.query.mockRejectedValue(gqlErr);

    await expect(userService.getUserRole('alice')).rejects.toThrow('Known');
  });
});
