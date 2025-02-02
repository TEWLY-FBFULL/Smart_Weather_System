// Import
const express = require('express');
const { readdirSync } = require('fs');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
// setup middleware
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(express.static('public')); // serve static files
app.use(cors()); // allow to receive request from different origin
app.use(cookieParser()); // parse cookie
// Loop all routes
readdirSync('./routes').map((r) => app.use('/api', require('./routes/' + r)));
// Run server
const PORT = process.env.PORT;
app.listen(PORT,() => {console.log(`Server is running on http://localhost:${PORT}`);});
