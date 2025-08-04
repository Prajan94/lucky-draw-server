const { createGraphQLError } = require('../common/errorService');
const loggerService = require('../common/loggerService');
const { validatePlayerInput } = require('../common/validationService');


describe('createGraphQLError', () => {
  it('should create GraphQLError with message and default code', () => {
    const error = createGraphQLError('Invalid', undefined, ['detail1']);
    expect(error.message).toBe('Invalid');
    expect(error.extensions.code).toBe('BAD_USER_INPUT');
    expect(error.extensions.details).toEqual(['detail1']);
  });

  it('should create GraphQLError with custom code', () => {
    const error = createGraphQLError('Not found', 'NOT_FOUND');
    expect(error.extensions.code).toBe('NOT_FOUND');
  });
});

describe('loggerService', () => {
  it('should log error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    loggerService.logError('msg', new Error('fail'));
    expect(spy).toHaveBeenCalledWith('msg', expect.any(Error));
    spy.mockRestore();
  });

  it('should log info', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    loggerService.logInfo('info', { data: 1 });
    expect(spy).toHaveBeenCalledWith('info', { data: 1 });
    spy.mockRestore();
  });

  it('should log warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    loggerService.logWarn('warn', { data: 2 });
    expect(spy).toHaveBeenCalledWith('warn', { data: 2 });
    spy.mockRestore();
  });
});

describe('validatePlayerInput', () => {
  it('should return error for empty name', () => {
    const result = validatePlayerInput({ name: '' });
    expect(result).toContain('Name is required.');
  });

  it('should return error for invalid name chars', () => {
    const result = validatePlayerInput({ name: 'Bad@Name' });
    expect(result).toContain('Name can contain only letters, numbers, and spaces.');
  });

  it('should return error for negative score', () => {
    const result = validatePlayerInput({ score: -1 });
    expect(result).toContain('Score must be a positive number.');
  });

  it('should return error for invalid id', () => {
    const result = validatePlayerInput({ id: -5 });
    expect(result).toContain('Id must be a positive number.');
  });

  it('should return empty array for valid input', () => {
    const result = validatePlayerInput({ name: 'Good Name', score: 10, id: 1 });
    expect(result).toEqual([]);
  });
});
