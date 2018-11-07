const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

const cars = require('./server/routes/api/cars');
app.use('/api/cars', cars);

const port = process.env.port || 5001;
app.listen(port, () => console.log('server started on port ' + port));