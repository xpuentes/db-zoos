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
    });
});

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => {
      res.status(500).json({message: 'Error loading data.'});
    });
});

server.get('/api/zoos/:id', (req, res) => {
  const { id } = req.params;

  db('zoos')
    .where({id: id})
    .first()
    .then(zoos => {
      if(zoos){
        res.status(200).json(zoos);
      } else {
        res.status(400).json({message: 'Zoo not found.'})
      }
    })
    .catch(err => {
      res.status(500).json({message: 'Error loading data'});
    });
});

server.delete('/api/zoos/:id', (req, res) => {
  const { id } = req.params;

  db('zoos')
    .where({id: id})
    .del()
    .then(count => {
      res.status(200).json(count);
    })
    .catch(err => {
      res.status(500).json({message: 'Unable to delete record.'});
    });
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
