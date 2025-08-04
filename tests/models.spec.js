const Player = require('../models/player');
const User = require('../models/user');

describe('Player model', () => {
  it('should create player instance correctly', () => {
    const data = { id: 1, name: 'Alice', title: 'Champion', score: 100, lastUpdated: '2025-08-01', userId: 2 };
    const player = new Player(data);

    expect(player.id).toBe(1);
    expect(player.name).toBe('Alice');
    expect(player.title).toBe('Champion');
    expect(player.score).toBe(100);
    expect(player.lastUpdated).toBe('2025-08-01');
    expect(player.userId).toBe(2);
  });

  it('should default title to empty string if not provided', () => {
    const player = new Player({ id: 2, name: 'Bob', score: 50, lastUpdated: '2025-08-01' });
    expect(player.title).toBe('');
  });
});

describe('User model', () => {
  it('should create user instance correctly', () => {
    const role = { id: 1, name: 'Admin' };
    const user = new User({ id: 10, username: 'john', role });

    expect(user.id).toBe(10);
    expect(user.username).toBe('john');
    expect(user.role).toEqual(role);
  });
});