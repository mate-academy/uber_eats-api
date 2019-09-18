// node modules
const express = require('express');
const server = express();
const port = process.env.PORT || 3000;

// routes
const uberRoutes = require('./routes/uberEats');

server.use('/api/uber', uberRoutes);

server.listen(port, (error) => {
  if (error) {
    throw new Error(error);
  } else {
    console.log(`Server started on ${port} port.`);
  }
});
