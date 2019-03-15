const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true,
});

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
server.post('/api/zoos', (req, res) => {
  const name = req.body;

  db.insert(name)
    .into('zoos')
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).json({message: 'Unable to add new zoo.'});
    })
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
