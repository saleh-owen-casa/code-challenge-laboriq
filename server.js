const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import Lambda functions
const postHandler = require('./lambda/subscriber-post');
const getHandler = require('./lambda/subscriber-get');
const listHandler = require('./lambda/subscriber-list');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/subscriber', async (req, res) => {
  try {
    const result = await postHandler.handler({
      body: JSON.stringify(req.body),
      queryStringParameters: req.query
    });
    
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/subscriber', async (req, res) => {
  try {
    const result = await getHandler.handler({
      queryStringParameters: req.query
    });
    
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/subscriber/list', async (req, res) => {
  try {
    const result = await listHandler.handler({
      queryStringParameters: req.query
    });
    
    res.status(result.statusCode).json(JSON.parse(result.body));
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
