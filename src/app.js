const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// ✅ Point this to the root folder so Express can find index.html and the assets/ folder
app.use(express.static(path.join(__dirname, '../')));

// Mandatory health endpoint for the pipeline
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '1.0.0' 
  });
});

module.exports = app;