const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Tell Express to serve all your HTML, CSS, and JS files from the root directory
app.use(express.static(path.join(__dirname, '../')));

// Create the mandatory /health endpoint required by your lab manual's smoke test
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(), 
    version: '1.0.0' 
  });
});

app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
});