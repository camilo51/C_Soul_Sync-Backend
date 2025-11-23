const express = require('express');
const routes = require('./routes.js');
const db = require('./config/db.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);


db.authenticate()
  .then(() => {
    console.log('Database connected...')
    db.sync({ alter: false });
  })
  .catch(err => console.log('Error: ' + err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));