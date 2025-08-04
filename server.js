const { createApp } = require('./app');

const PORT = process.env['PORT'] || 4000;

createApp()
  .then(app => {
    app.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    });
  })
  .catch(err => {
    console.error('Failed to start server', err);
  });
