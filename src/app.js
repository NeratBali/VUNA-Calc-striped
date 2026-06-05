const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../')));

app.get('/calcuate', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '1.0.0' 
  });
});

module.exports = app; // Export it so other files can require it!