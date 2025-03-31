const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/restaurants/:postcode', async (req, res) => {
  try {
    const { postcode } = req.params;
    
    const response = await axios.get(
      `https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/${postcode}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});