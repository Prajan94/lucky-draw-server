const { GraphQLError } = require('graphql');

exports.createGraphQLError = (message, code = 'BAD_USER_INPUT', details = []) => {
  return new GraphQLError(message, {
    extensions: {
      code,
      details
    }
  });
};