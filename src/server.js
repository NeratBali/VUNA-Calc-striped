const app = require('./app'); // Import the configuration safely
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Calculator server running on port ${PORT}`);
});