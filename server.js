// Import
const express = require('express');
const { readdirSync } = require('fs');
require('dotenv').config();
const cors = require('cors');

const app = express();

// setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

// Loop all routes
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));

// Run server
const PORT = process.env.PORT;
app.listen(PORT,() => {console.log(`Server is running on http://localhost:${PORT}`);});
