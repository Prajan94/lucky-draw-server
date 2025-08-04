class Player {
    constructor({ id, name, title, score, lastUpdated, userId }) {
      this.id = id;
      this.name = name;
      this.title = title || '';
      this.score = score;
      this.lastUpdated = lastUpdated;
      this.userId = userId;
    }
  }
  
  module.exports = Player;  