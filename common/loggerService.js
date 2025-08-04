module.exports = {
  logError: (message, error) => {
    console.error(message, error);
  },
  logInfo: (message, data) => {
    console.info(message, data);
  },
  logWarn: (message, data) => {
    console.warn(message, data);
  }
};